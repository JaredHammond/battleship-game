const Ship = (length) => {
  let hitCount = 0

  const isSunk = () => {
    if (hitCount < length) {
      return false;
    } else {
      return true;
    }
  }

  const hit = () => {
    hitCount += 1
  }

  const getLength = () => {
    return length;
  }

  return {
    isSunk,
    hit,
    getLength
  }
}

module.exports = Ship;