exports.handler = async (event) => {
    const userAgent = event.headers['user-agent'] || '';
    if (userAgent.toLowerCase().includes('curl') || userAgent.toLowerCase().includes('wget')) {
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: `
                            . ­       	              	      	      	    
                          -#*#*.       	entitybtw | psp-dev & technofreak                    
                         :#*+*#=       	──────────────────────────────────             	
                          =++*=         os: gentoo linux                                      
                         .:*#+         	telegram: @entitybtw                  	
                       :+-.==-=-        github: @entitybtw                   
         .-=-          *-    :**..     	twitch: @entitybtw_                  
         +###=        -* .    -#:.      youtube: @entitybtw                    
	      -==.        *#-::::.-#+.      last fm: @entitybtw                  
          :=-.       :%#=---::*%%-      discord: @entitybtw                   
        .     ..      ::-:::.=+*=       minecraft: @entitybtw                  	
        -.....-:.      ... .:.:+.       steam: @entitybtw              
        =.....:+:     .==----+%@#.      roblox: @ejrjmjjj                     
       .=....:.--     :+###%####.       website: entitybtw.ru   	      	     
       .:...:::::     +***##****.       blog: blog.entitybtw.ru                               
       .=:*****=:    .***####***
         =@@%%%%*    +*### -###*
         =@@: *@%    +###:  ###+
         +@*  :%@.   =##=   ###:
        .@@.   #@.  :#%#    ##+
        -@%    #@=  *##+   :##*.
       =%=     -@=.+==-     :*#
                =:..         .=.
                              ..
            `,
        };
    } else {
        return {
            statusCode: 301,
            headers: {
                Location: 'https://slat.cc/entitybtw',
            },
        };
    }
};
