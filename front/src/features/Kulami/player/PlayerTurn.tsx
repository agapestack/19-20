

// To show at top right of the screen
const PlayerTurn = () => {

//   useEffect(() => {
//     switch(kulami.player) {
//         case RED:
//             setImgSrc("../assets/kulami_marbleBlack.png")
//             kulami.player = BLACK;
//             break;
//         case BLACK:
//             setImgSrc("../assets/kulami_marbleRed.png")
//             kulami.player = RED;
//             break;
//         default:
//     }
//   }, [kulami.nbBlackPawn, kulami.nbRedPawn]);


  return (
    <div>
   
        <img className='h-max w-max' src={process.env.PUBLIC_URL + "/kulami/kulami_marbleRed.png"} alt='marble' />
    </div>
  )
}

export default PlayerTurn;