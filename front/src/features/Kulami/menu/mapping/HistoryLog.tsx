import { useAppSelector } from '../../../../app/hooks'
import { PositionDataInterface } from '../../../../config/kulami.config'
import { generateRandomString } from '../../../../utils/utils'
import { selectKulami } from '../../KulamiSlice'

const HistoryLog = () => {
  const kulami = useAppSelector(selectKulami);

  return (
    <div className="flex flex-col">
        <div>
            {kulami.positionStack.map((e: PositionDataInterface, i: number) => (
                <div id={String(i) + generateRandomString(5)}>
                    {e.posX}-{e.posY}
                </div>
            ))}
        </div>
    </div>
  )
}

export default HistoryLog