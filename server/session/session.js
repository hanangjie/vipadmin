
var setHeader = function (req, res, next) {
    var writeHead = res.writeHead;
    res.writeHead = function () {
        var cookies = res.getHeader('Set-Cookie');
        cookies = cookies || [];
        console.log('writeHead, cookies: ' + cookies);
        var session = serialize('session_id', req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) :
                  [cookies, session];
        res.setHeader('Set-Cookie', cookies);
        return writeHead.apply(this, arguments);
    };
 
    next();
};