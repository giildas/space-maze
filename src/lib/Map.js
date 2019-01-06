export default function map (num, origMin, origMax, tgtMin, tgtMax) {
  return (num - origMin) * (tgtMax - tgtMin) / (origMax - origMin) + tgtMin
}
