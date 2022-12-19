// Generate -1 values 2x2 matrix
export const generateInitBoardArray = (nbRow: number, nbColumn: number) => {
  var res = new Array(nbRow);
  for (let i = 0; i < nbRow; i++) {
    res[i] = new Array(nbColumn).fill(-1);
  }
  return res;
};
