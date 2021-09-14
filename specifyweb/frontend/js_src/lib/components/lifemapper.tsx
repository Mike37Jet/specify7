import '../../css/lifemapper.css';

import React from 'react';

import { SN_SERVICES } from '../lifemapperconfig';
import { prepareLifemapperProjectionMap } from '../lifemappermap';
import { reducer } from '../lifemapperreducer';
import {
  fetchLocalScientificName,
  formatOccurrenceDataRequest,
} from '../lifemapperutills';
import commonText from '../localization/common';
import lifemapperText from '../localization/lifemapper';
import type { MainState } from './lifemapperstate';
import { stateReducer } from './lifemapperstate';
import type { ComponentProps } from './lifemapperwrapper';
import type { IR, RA } from './wbplanview';

type FullAggregatorResponse = {
  readonly records: RA<{
    readonly count: number;
    readonly provider: {
      readonly code: string;
    };
    readonly records: RA<{
      readonly 's2n:issues': IR<string>;
      readonly 'dwc:scientificName': string;
    }>;
  }>;
};

export function Lifemapper({
  model,
  guid,
}: ComponentProps): JSX.Element | null {
  const [state, dispatch] = React.useReducer(reducer, {
    type: 'MainState',
    badges: Object.fromEntries(
      Object.entries(SN_SERVICES).map(([name, label]) => [
        name,
        {
          label,
          isOpen: false,
          isActive: true,
        },
      ])
    ),
    mapInfo: commonText('loading'),
  } as MainState);

  // Fetch occurrence data
  React.useEffect(() => {
    if (typeof guid === 'undefined') return;

    fetch(formatOccurrenceDataRequest(guid), {
      mode: 'cors',
    })
      .then(async (response) => response.json())
      .then((response: FullAggregatorResponse) =>
        response.records
          .filter(({ count }) => count > 0)
          .map(({ records }) => records[0]['dwc:scientificName'])
          .find((occurrenceName) => occurrenceName)
      )
      .catch(console.error)
      .then(
        (remoteOccurrence) =>
          remoteOccurrence ?? fetchLocalScientificName(model)
      )
      .catch(console.error)
      .then((occurrenceName) =>
        dispatch({
          type: 'SetOccurrenceNameAction',
          occurrenceName: occurrenceName ?? '',
        })
      )
      .catch(console.error);
  }, [guid, model]);

  /*
   * Fetch related CO records
   * Fetch projection map
   */
  const occurrenceName =
    state.type === 'MainState' ? state.occurrenceName : undefined;
  const isOpen =
    state.type === 'MainState' ? state.badges.lm.isOpen : undefined;
  const mapInfo = state.type === 'MainState' ? state.mapInfo : undefined;
  React.useEffect(() => {
    if (
      !Boolean(isOpen) ||
      typeof occurrenceName === 'undefined' ||
      typeof mapInfo === 'object'
    )
      return;

    if (!occurrenceName) {
      dispatch({ type: 'DisableBadgeAction', badgeName: 'lm' });
      dispatch({
        type: 'MapLoadedAction',
        mapInfo: `
          ${lifemapperText('errorsOccurred')}\n
          ${lifemapperText('noMap')}`,
      });
      return;
    }

    prepareLifemapperProjectionMap(occurrenceName, model)
      .then((mapInfo) =>
        dispatch({
          type: 'MapLoadedAction',
          mapInfo:
            mapInfo.layers.length === 0 && mapInfo.markers.length === 0
              ? `${lifemapperText('errorsOccurred')}\n\n
                ${
                  Object.keys(mapInfo.messages.errorDetails).length === 0
                    ? Object.values(mapInfo.messages.errorDetails).join('\n')
                    : lifemapperText('noMap')
                }`
              : mapInfo,
        })
      )
      .catch(() => dispatch({ type: 'DisableBadgeAction', badgeName: 'lm' }));
  }, [occurrenceName, mapInfo, isOpen, model]);

  // eslint-disable-next-line unicorn/no-null
  return stateReducer(null, {
    ...state,
    params: {
      dispatch,
      guid,
    },
  });
}
