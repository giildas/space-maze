export function map (num, origMin, origMax, tgtMin, tgtMax) {
  return (num - origMin) * (tgtMax - tgtMin) / (origMax - origMin) + tgtMin
}
export function round (num, precision = 0) {
  const mult = Math.pow(10, precision)

  return Math.round(num * mult) / mult
}

