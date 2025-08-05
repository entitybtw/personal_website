export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';

  if (/curl|wget/i.test(userAgent)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(`
                         . ­                                     
                       -#*#*.       entitybtw | psp-dev & technofreak                    
                      :#*+*#=       ──────────────────────────────────             
                       =++*=         os: bedrock linux                                      
                      .:*#+         telegram: @entitybtw                  
                    :+-.==-=-        github: @entitybtw                   
      .-=-          *-    :**..     twitch: @entitybtw_                  
      +###=        -* .    -#:.      youtube: @entitybtw                    
       -==.        *#-::::.-#+.      last fm: @entitybtw                  
       :=-.       :%#=---::*%%-      discord: @entitybtw                   
     .     ..      ::-:::.=+*=       minecraft: @entitybtw                  
     -.....-:.      ... .:.:+.       steam: @entitybtw              
     =.....:+:     .==----+%@#.      roblox: @ejrjmjjj                     
    .=....:.--     :+###%####.       website: entitybtw.ru              
    .:...:::::     +***##****.       blog: blog.entitybtw.ru                               
    .=:*****=:    .***####***        donate: donate.entitybtw.ru
      =@@%%%%*    +*### -###*
      =@@: *@%    +###:  ###+
      +@*  :%@.   =##=   ###:
     .@@.   #@.  :#%#    ##+
     -@%    #@=  *##+   :##*.
    =%=     -@=.+==-     :*#
             =:..         .=.
                           ..
    `);
  } else {
    res.writeHead(301, { Location: 'https://entitybtw.ru/' });
    res.end();
  }
}
