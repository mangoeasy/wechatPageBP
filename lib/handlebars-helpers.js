module.exports.register = function (Handlebars, options)  {

  /**
  * This helper provides modulo support
  *
  * n is the number to test
  * m is the modulo to test it with
  * The block is rendered if n % m equals 0,
  * else block (if provided) is rendered instead
  *
  * Usage: class='{{#modulo 10 2}} even {{else}} odd {{/modulo}}'
  *
  * @url https://github.com/johanpoirier/resthub-backbone-stack/commit/8a318477d56c370d2a0af4da6eae9999c7bb29da
  */
  Handlebars.registerHelper( 'modulo', function( n, m, str ) {
     if(n !== 0 && (n % m) === 0) {
         return str.fn();
     } else {
         return str.inverse();
     }
  });

  /**
   * Basic foor loop
   * @param  {[type]} n     [description]
   * @param  {[type]} block [description]
   * @return {[type]}       [description]
   */
  Handlebars.registerHelper( 'times', function( n, block ) {
    var accum = '';
    for( var i = 0; i < n; ++i )
      accum += block.fn(i);
    return accum;
  });
};