module.exports = {
  isItemExecutable: function(item) {
    return item.type.match(/symlink|application|executable/);
  }
};