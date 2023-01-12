import React from 'react'
import { useAppSelector } from '../../../app/hooks';
import { RED } from '../../../config/kulami.config';
import { selectKulami } from '../KulamiSlice';

export interface PlayerProfileProps {
  player: number;
}

const PlayerProfile = ({player}: PlayerProfileProps) => {
  const kulami = useAppSelector(selectKulami);
  return (
    <div>{(player === RED) ? kulami.redScore : kulami.blackScore}</div>
  )
}

export default PlayerProfile