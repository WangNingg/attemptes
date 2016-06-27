module.exports = {
  rules: [
    {
      pattern: /\/api\/getLivelist.php\?rtype=origin$/,
      respondwith: './livelist.json'
    },
    {
      pattern: /\/api\/getLivelist.php\?rtype=more$/,
      respondwith: './livelist-more.json'
    },
    {
      pattern: /\/api\/getNavlist.php\?rtype=origin$/,
      respondwith: './navlist.json'
    },
    {
      pattern: /\/api\/getNavlist.php\?rtype=more$/,
      respondwith: './navlist-more.json'
    }

 ]
};
