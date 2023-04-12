import { IR, overwriteReadOnly, RA } from '../../utils/types';
import { AnySchema, AnyTree, CommonFields, TableFields } from './helperTypes';
import { SpecifyResource } from './legacyTypes';
import { BusinessRuleDefs, businessRuleDefs } from './businessRuleDefs';
import { flippedPromise, ResolvablePromise } from '../../utils/promise';
import { isTreeResource } from '../InitialContext/treeRanks';
import { initializeTreeRecord, treeBusinessRules } from './treeBusinessRules';
import { Collection } from './specifyModel';
import { SaveBlockers } from './saveBlockers';
import { formatConjunction } from '../Atoms/Internationalization';
import { formsText } from '../../localization/forms';
import { LiteralField, Relationship } from './specifyField';
import { idFromUrl } from './resource';

export class BusinessRuleManager<SCHEMA extends AnySchema> {
  private readonly resource: SpecifyResource<SCHEMA>;
  private readonly rules: BusinessRuleDefs<SCHEMA | AnySchema> | undefined;
  public pendingPromises: Promise<BusinessRuleResult | null> =
    Promise.resolve(null);
  private fieldChangePromises: {
    [key: string]: ResolvablePromise<string>;
  } = {};
  private watchers: { [key: string]: () => void } = {};

  public constructor(resource: SpecifyResource<SCHEMA>) {
    this.resource = resource;
    this.rules = businessRuleDefs[this.resource.specifyModel.name];
  }

  private addPromise(
    promise: Promise<BusinessRuleResult | string | void | undefined>
  ): void {
    this.pendingPromises = Promise.allSettled([
      this.pendingPromises,
      promise,
    ]).then(() => null);
  }

  private changed(resource: SpecifyResource<SCHEMA>): void {
    if (resource.changed !== undefined) {
      Object.keys(resource.changed).forEach((field) => {
        this.checkField(field);
      });
    }
  }

  private removed(
    resource: SpecifyResource<SCHEMA>,
    collection: Collection<SCHEMA>
  ): void {
    this.addPromise(
      this.invokeRule('onRemoved', undefined, [resource, collection])
    );
  }

  public setUpManager(): void {
    this.addPromise(this.invokeRule('customInit', undefined, [this.resource]));
    if (isTreeResource(this.resource as SpecifyResource<AnySchema>))
      initializeTreeRecord(this.resource as SpecifyResource<AnyTree>);

    this.resource.on('change', this.changed, this);
    this.resource.on('remove', this.removed, this);
  }

  public async checkField(
    fieldName: keyof SCHEMA['fields']
  ): Promise<BusinessRuleResult | void> {
    fieldName =
      typeof fieldName === 'string' ? fieldName.toLowerCase() : fieldName;
    const thisCheck: ResolvablePromise<string> = flippedPromise();
    this.addPromise(thisCheck);

    this.fieldChangePromises[fieldName as string] !== undefined &&
      this.fieldChangePromises[fieldName as string].resolve('superseded');
    this.fieldChangePromises[fieldName as string] = thisCheck;

    const checks = [
      this.invokeRule('fieldChecks', fieldName, [this.resource]),
      this.checkUnique(fieldName),
    ];

    if (isTreeResource(this.resource as SpecifyResource<AnySchema>))
      checks.push(
        treeBusinessRules(
          this.resource as SpecifyResource<AnyTree>,
          fieldName as string
        )
      );

    return Promise.all(checks)
      .then((results) => {
        return thisCheck === this.fieldChangePromises[fieldName as string]
          ? this.processCheckFieldResults(fieldName, results)
          : undefined;
      })
      .then(() => thisCheck.resolve('finished'));
  }

  private processCheckFieldResults(
    fieldName: keyof SCHEMA['fields'],
    results: RA<BusinessRuleResult | undefined | void>
  ): Promise<RA<void | null>> {
    return Promise.all(
      results.map((result) => {
        if (!result) return null;
        if (result.key === undefined) {
          if (result.valid)
            return typeof result.action === 'function' ? result.action() : null;
          return null;
        }
        if (result.valid === false) {
          this.resource.saveBlockers!.add(
            result.key,
            fieldName as string,
            result.reason
          );
        } else {
          this.resource.saveBlockers!.remove(result.key);
          return typeof result.action === 'function' ? result.action() : null;
        }
      })
    );
  }

  private async checkUnique(
    fieldName: keyof SCHEMA['fields']
  ): Promise<BusinessRuleResult> {
    const toOneFields =
      this.rules?.uniqueIn !== undefined
        ? this.rules?.uniqueIn[fieldName as Lowercase<TableFields<SCHEMA>>] ??
          []
        : [];

    // Typescript thinks that map() does not exist on NonNullable<UniquenessRule<SCHEMA>>
    // However, map() exists on every possible type of UniquenessRule<SCHEMA>
    // @ts-expect-error
    const results: RA<Promise<BusinessRuleResult<SCHEMA>>> = toOneFields.map(
      (
        uniqueRule: string | null | { field: string; otherFields: string[] }
      ) => {
        let field = uniqueRule;
        let fieldNames: string[] | null = [fieldName as string];
        if (uniqueRule === null) {
          fieldNames = null;
        } else if (typeof uniqueRule != 'string') {
          fieldNames = fieldNames.concat(uniqueRule.otherFields);
          field = uniqueRule.field;
        }
        return this.uniqueIn(field as string, fieldNames);
      }
    );

    Promise.all(results).then((results) => {
      results
        .map((result: BusinessRuleResult<SCHEMA>) => result['localDuplicates'])
        .flat()
        .filter((result) => result !== undefined)
        .forEach((duplicate: SpecifyResource<SCHEMA> | undefined) => {
          if (duplicate === undefined) return;
          const event = duplicate.cid + ':' + (fieldName as string);
          if (!this.watchers[event]) {
            this.watchers[event] = () =>
              duplicate.on('change remove', () => this.checkField(fieldName));
          }
        });
    });
    return Promise.all(results).then((results) => {
      const invalids = results.filter((result) => !result.valid);
      return invalids.length < 1
        ? { key: 'br-uniqueness-' + (fieldName as string), valid: true }
        : {
            key: 'br-uniqueness-' + (fieldName as string),
            valid: false,
            reason: formatConjunction(
              invalids.map(
                (invalid) =>
                  invalid['reason' as keyof BusinessRuleResult] as string
              )
            ),
          };
    });
  }

  private getUniqueInvalidReason(
    parentFieldInfo: Relationship | LiteralField,
    fieldInfo: RA<LiteralField | Relationship>
  ): string {
    if (fieldInfo.length > 1)
      return parentFieldInfo
        ? formsText.valuesOfMustBeUniqueToField({
            values: formatConjunction(fieldInfo.map((fld) => fld.label)),
            fieldName: parentFieldInfo.label,
          })
        : formsText.valuesOfMustBeUniqueToDatabase({
            values: formatConjunction(fieldInfo.map((fld) => fld.label)),
          });
    else
      return parentFieldInfo
        ? formsText.valueMustBeUniqueToField({
            fieldName: parentFieldInfo.label,
          })
        : formsText.valueMustBeUniqueToDatabase();
  }

  private uniqueIn(
    toOneField: string | undefined | null,
    fieldNames: RA<string> | string | null
  ): Promise<BusinessRuleResult<SCHEMA>> {
    if (fieldNames === null) {
      return Promise.resolve({
        valid: false,
        reason: formsText.valueMustBeUniqueToDatabase(),
      });
    }
    fieldNames = Array.isArray(fieldNames) ? fieldNames : [fieldNames];

    const fieldValues = fieldNames.map((value) => this.resource.get(value));

    const fieldInfo = fieldNames.map(
      (field) => this.resource.specifyModel.getField(field)!
    );

    const fieldIsToOne = fieldInfo.map(
      (field) => field?.type === 'many-to-one'
    );

    const fieldIds = fieldValues.map((value, index) => {
      if (fieldIsToOne[index] != null) {
        if (value == null || value === undefined) {
          return null;
        } else {
          return idFromUrl(value);
        }
      } else return undefined;
    });

    const toOneFieldInfo =
      toOneField !== null && toOneField !== undefined
        ? (this.resource.specifyModel.getField(toOneField) as Relationship)
        : undefined;

    const allNullOrUndefinedToOnes = fieldIds.reduce(
      (previous, _current, index) =>
        previous && fieldIsToOne[index] ? fieldIds[index] === null : false,
      true
    );

    const invalidResponse: BusinessRuleResult<SCHEMA> = {
      valid: false,
      reason:
        toOneFieldInfo !== undefined &&
        !fieldInfo.some((field) => field === undefined)
          ? this.getUniqueInvalidReason(toOneFieldInfo, fieldInfo)
          : '',
    };

    if (allNullOrUndefinedToOnes) return Promise.resolve({ valid: true });

    const hasSameValues = (other: SpecifyResource<SCHEMA>): boolean => {
      const hasSameValue = (
        fieldValue: string | number | null,
        fieldName: string
      ): boolean => {
        if (other.id != null && other.id === this.resource.id) return false;
        if (other.cid === this.resource.cid) return false;
        const otherValue = other.get(fieldName);

        return fieldValue === otherValue;
      };

      return fieldValues.reduce(
        (previous, current, index) =>
          previous && hasSameValue(current, fieldNames![index]),
        true
      );
    };

    if (toOneField != null) {
      const localCollection =
        this.resource.collection?.models !== undefined
          ? this.resource.collection.models.filter(
              (resource) => resource !== undefined
            )
          : [];

      const duplicates = localCollection.filter((resource) =>
        hasSameValues(resource)
      );

      if (duplicates.length > 0) {
        overwriteReadOnly(invalidResponse, 'localDuplicates', duplicates);
        return Promise.resolve(invalidResponse);
      }

      const relatedPromise: Promise<SpecifyResource<AnySchema>> =
        this.resource.rgetPromise(toOneField);

      return relatedPromise.then((related) => {
        if (!related) return Promise.resolve({ valid: true });
        const filters: Partial<IR<boolean | number | string | null>> = {};
        for (let f = 0; f < fieldNames!.length; f++) {
          filters[fieldNames![f]] = fieldIds[f] || fieldValues[f];
        }
        const others = new this.resource.specifyModel.ToOneCollection({
          related: related,
          field: toOneFieldInfo,
          filters: filters as Partial<
            {
              readonly orderby: string;
              readonly domainfilter: boolean;
            } & SCHEMA['fields'] &
              CommonFields &
              IR<boolean | number | string | null>
          >,
        });

        return others.fetch().then((fetchedCollection) => {
          const inDatabase = fetchedCollection.models.filter(
            (otherResource) => otherResource !== undefined
          );

          if (inDatabase.some((other) => hasSameValues(other))) {
            return invalidResponse;
          } else {
            return { valid: true };
          }
        });
      });
    } else {
      const filters: Partial<IR<boolean | number | string | null>> = {};

      for (let f = 0; f < fieldNames.length; f++) {
        filters[fieldNames[f]] = fieldIds[f] || fieldValues[f];
      }
      const others = new this.resource.specifyModel.LazyCollection({
        filters: filters as Partial<
          {
            readonly orderby: string;
            readonly domainfilter: boolean;
          } & SCHEMA['fields'] &
            CommonFields &
            IR<boolean | number | string | null>
        >,
      });
      return others.fetch().then((fetchedCollection) => {
        if (
          fetchedCollection.models.some((other: SpecifyResource<SCHEMA>) =>
            hasSameValues(other)
          )
        ) {
          return invalidResponse;
        } else {
          return { valid: true };
        }
      });
    }
  }

  private async invokeRule(
    ruleName: keyof BusinessRuleDefs<SCHEMA>,
    fieldName: keyof SCHEMA['fields'] | undefined,
    args: RA<any>
  ): Promise<BusinessRuleResult | undefined | void> {
    if (this.rules === undefined || ruleName === 'uniqueIn') {
      return Promise.resolve(undefined);
    }
    let rule = this.rules[ruleName];

    if (
      rule !== undefined &&
      ruleName === 'fieldChecks' &&
      fieldName !== undefined
    )
      rule = rule[fieldName as keyof typeof rule];

    if (rule === undefined) return Promise.resolve(undefined);

    // For some reason, Typescript still thinks that this.rules["fieldChecks"] is a valid rule
    // thus rule.apply() would be invalid
    // However, rule will never be this.rules["fieldChecks"]
    // @ts-expect-error
    return Promise.resolve(rule.apply(undefined, args));
  }
}

export function attachBusinessRules(
  resource: SpecifyResource<AnySchema>
): void {
  const businessRuleManager = new BusinessRuleManager(resource);
  overwriteReadOnly(resource, 'saveBlockers', new SaveBlockers(resource));
  overwriteReadOnly(resource, 'businessRuleManager', businessRuleManager);
  businessRuleManager.setUpManager();
}

export type BusinessRuleResult<SCHEMA extends AnySchema = AnySchema> = {
  readonly key?: string;
  readonly localDuplicates?: RA<SpecifyResource<SCHEMA>>;
} & (
  | {
      readonly valid: true;
      readonly action?: () => void;
    }
  | { readonly valid: false; readonly reason: string }
);
