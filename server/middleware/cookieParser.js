const parseCookies = (req, res, next) => {
  let cookieString = req.get('Cookie') || '';

  // console.log(req.get('Cookie'));
  let parsedCookies = cookieString.split('; ').reduce((cookies, cookie) => {
    if (cookie.length) {
      let idx = cookie.indexOf('=');
      let key = cookie.slice(0, idx);
      let token = cookie.slice(idx + 1);
      cookies[key] = token;
    }
    return cookies;
  },
  {}
  );
  req.cookies = parsedCookies;
  // console.log('req.cookies', req.cookies);
  next();
};

module.exports = parseCookies;