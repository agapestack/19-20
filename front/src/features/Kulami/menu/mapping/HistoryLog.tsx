import React from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { PositionDataInterface } from '../../../../config/kulami.config'
import { selectKulami } from '../../KulamiSlice'
import { generateRandomString } from '../../../../utils/utils'

const HistoryLog = () => {
  const kulami = useAppSelector(selectKulami);

  return (
    <div className="flex flex-col items-center">
        <div>
            {kulami.positionStack.map((e: PositionDataInterface, i: number) => (
                <div id={String(i) + generateRandomString(5)}>
                    <p className="font-mono font-semibold">{e.posX}-{e.posY}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default HistoryLog