const getCount = (lastPage) => {
    return Math.ceil(lastPage / 10)
}

module.exports = { getCount }