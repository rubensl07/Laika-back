module.exports = { 
    tratarData(dataObject) {
        const data = new Date(dataObject);
        return `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, '0')}-${String(data.getUTCDate()).padStart(2, '0')}`
    }
}