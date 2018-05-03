module.exports = function (res, status, content) {
   res.status(status);
   res.json(content);
};
