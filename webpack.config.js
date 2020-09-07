const HtmlWebPackPlugin       = require('html-webpack-plugin'); 
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');

module.exports = {
    /*
        mode: Existen tres tipos, [ development | production | none] 
            el modo development empaqueta todo el proyecto en un solo bundle o los que se hayan
            propuesto, puede dejarse para que no se ofusque el codigo o minimice
            El modo production realiza el minimizado del codigo, ofuscamiento y listo para prod
    */
    mode: 'development',
    /*
    entry: ayuda a saber cual es el archivo principal que será el nodo para crear el arbol
           de dependencias
           si existen mas entradas, se pasan cada archivo en un objeto, pj...ademas tambien se debe colocar al final
           entry: {
                js: './src/index.js',
                vanilla: './src/hello_vanilla.js'
           }
           o si solo hay una entrada, seria en un string
           entry: './src/index.js',

           los valores de js y vanilla sirve para referenciar el js en la salida del HtmlWebpackPlugin
           new HtmlWebpackPlugin({
                template: './src/template.html',
                filename: 'index.html',
                chunks: ['js'] -> apunta a la entrada descrita
           }),
    */
    entry: {
        js: './src/index.js',
        vanilla: './src/js/otroComponent.js'
    },
    /*
     output: crea el cómo será el archivo de salida, por default es ./dist/main.js 
             aqui se puede cambiar el nombre del archivo o la ruta
             la variable path apunta al directorio de este proyecto con la ayuda de node
    */
    output: {
        path: path.resolve(__dirname, 'dist'), // para crear la carpeta dist
        filename: '[name].bundle.js'
    },
    optimization: { 
        /* un nuevo elemento para optimizar los archivos css, en este caso el minimizado
           realiza todo el minimizado en el modo produccion
           por default usa cssnano, recibe las siguientes optiones
           assetNameRegExp: Una expresion regular que indica los nombres de los assets q seran optimizados/minimizados
           solo lo aplicará a los archivos exportados extractTextplugin u otro, por default es /\.css$/g
           cssProcessor: El procesador css usado para optimizar/minimizar, default es cssnano
           cssProcessorOptions: Opciones pasadas por el cssProcessor, defaults es {}
           cssProcessorPluginOptions: el plugin pasado por el cssProcessor, defaults {}
           canPrint: Un booleano que indica si el plugin puede imrpimir mensajes en la consola, default es true
        */
        minimizer: [ new OptimizeCssAssetsPlugin() ],
        /**
         * la siguiente optimizacion es cuando existen varios archivos .js o bundle que comparten
         * configuracion en comun, por ejemplo la de webpack, para separar ese codigo comun en un
         * solo archivo e independizar lo que realmente tiene cada archivo bundle aparte, se requiere
         * lo siguiente, ( esto hará que se enlace en los html en archivo common y el bundle de cada html)
         * no requiere ninguna instalacion, esto es configuracion de webpack
         */
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/, // las configuraciones de webpack
                    name: 'common', //creará un archivo con nombre common
                    chunks: 'all'
                }
            }
        }
    },
    /*
        loaders: Ya que webpack solo entiende Javascript y Json, los loaders permitiran
                 a webpack procesar otros tipo de archivo como css, scss, imagenes, templates
                 como pug, etc... esto los convierte en modulos validos que pueden ser consumidos
                 por la aplicacion y añadirlos al arbol de dependencias. Se tienen dos propiedades
                 test: propiedad que identifica cual(es) archivo(s) serán transformados
                 use: propiedad que indica Qué loader será usado para hacer las transformaciones
    */
    module: {
        rules: [
            {   /*
                Para este caso, se busca que los archivos .css que sean importados directamente
                desde los archivos .js se acoplen al bundle, se usan dos loader, style-loader
                y css-loader para minimizar los css, y tambien se indica que se excluye un archivo
                css que se encuentra de manera global en el proyecto, ya que este se importa es
                en el html y en un archivo independiente.
                Ambos loaders van de la mano
                css-loader: tiene 6 opciones en true, que hacen el trabajo de minimizar y aceptar
                            tipos de elementos en los css, que son: url{true}, import{true}, 
                            modules{auto:true}, sourceMap{compiler:devtool}, importLoaders{0},esModule{true}
                style-loader: tiene 5 opciones para manejar propiedades en el css, q son: injectType{styleTag}
                            attributes{}, insert{head}, base{true}, esModule{false}
                */
                test: /\.css$/,
                exclude: /styles\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {   
                /**
                 * Para archivos sass se ayuda de loader como sass-loader y node-sass
                 */
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'sass-loader'}
                ]
            },
            {
                /*
                    Con el loader minicssextractplugin, saca un archivo styles independiente al bundle
                    y en este caso solo lo aplica a un solo archivo llamado styles.css
                    Se recomienda combiar este plugin con el loader de css-loader
                */
                test: /styles\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            /*
                configuracion sass, scss y css, se necesita instalar los loaders 
                - postcss-loader
                - resolve-url-loader
                - sass-loader
                - node-sass
                tambien instalar autoprefixer e importarlo
                    const autoprefixer = require('autoprefixer');
                ademas agregar al module.exports:
                     devtool: 'source-map',
                y agregar a rules:
                {
                    test: /\.(css|scss|sass)$/,
                    use: [
                        'styled-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader?minimize&sourceMap',
                        {
                            loader: 'postcss-loader',
                            options: {
                                autoprefixer: {
                                    browser: ['last 2 versions']
                                },
                                sourceMap: true,
                                plugins: () => [autoprefixer]
                            }
                        },
                        'resolve-url-loader',
                        'sass-loader?outputStyle=compressed&sourceMap'
                    ]
                }
            */
            {
                /*
                 html-loader ayuda a minimizar el html, tiene 4 opciones
                  attributes: Type {Boolean|Objet} que default es true y ayuda a habilitar o deshabilitar el manejo de atributos
                  preprocessor: Type Function que default es undefine y Permite el procesamiento previo del contenido antes de su manipulación.
                  minimize: Type Boolean|Object que default true en production y en otro modo false y permite el minimizado del html
                  esModule: Type Boolean que default es false y permite que se Utilice la sintaxis de los módulos ES
                */
                test: /\.html$/, 
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false }
                    }
                ]
            },
            {
                /**
                  Para imagenes o assets q son requeridos en el html se usa el loader, file-loader
                    name: 'assets/[name].[ext]' indica que se guarden los assets al hacer el build
                    en la carpeta assets, con el mismo nombre y extension. por default se guardan
                    los assets hasheados y en la raiz de la carpeta /dist
                    las opciones son:
                    name: Type: String|Function Default: '[contenthash].[ext]'
                    otros serian, outputPath, publicPath, postTransformPublicPath, context, emitFile,regExp
                    esModule y los placeholdes como: [ext], [name], [path],[folder],[query], [emoji], [hash]
                    [contenthash], [<hashType>:hash:<digestType>:<length>]{digestType: String 'hex'}{hashType: String 'md4}

                    Si se desea comprimir las imagenes cuando se hace el build, se puede complementar con otro loarder
                    llamado image-webpack-loader y con file-loader. En este config no se desea comprimir
                    y seria su configuracion como esta:
                    {
                        test: /\.(jpe?g|png|gif|svg|webp)$/i,
                        use: [
                            'file-loader?name=assets/[name].[ext]',
                            'image-webpack-loader?bypassOnDebug'
                        ]
                    }
                 */
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: 'assets/[name].[ext]' 
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff2?|mp4|mp3|txt|xml|pdf)$/i,
                use: 'file-loader?name=assets/[name].[ext]'
            }
        ]
    },
    /*
        plugins: Ayudan a aumentar el performance y el rango de tareas para la optimizacion del
                 bundle, administracion de archivos, inyeccion de variables. Se necesita la instancia
                 del plugin llamandolo con el operador new y pasar las opciones que se desean
    */
    plugins: [
        /**
         * Si existen mas archivo html de salida se debe independizar. Un ejemplo de otro archivo
         * html aparte del index.html
         * new HtmlWebpackPlugin({
            template: './src/template.html',
            filename: 'vanilla.html',
            chunks: ['vainilla'] //los chunks son otras options que se pasan cuando se desea pasar la referencia del js descrito en el entry, ya que cuando hay varias entradas, se pasa un objeto
        })
         */
        new HtmlWebPackPlugin({  // Ayuda a crear un html5 y moverlo a la carpeta dist y referenciar los bundle creados js. simplifica la creacion del html
            template: './src/index.html', // se toma como template el archivo indicado aqui
            filename: './index.html',   // el nombre del archivo que será exportado a la carpeta /dist   
            chunks: ['js']
        }),                      // Si existen varias entradas se incluiran tamb a ellos, tambien se incluiran los link de css
        new HtmlWebPackPlugin({  
            template: './src/nosotros.html', 
            filename: './nosotros.html',
            chunks: ['vanilla']   
        }),
        new MiniCssExtractPlugin({// ayuda a sacar un archivo styles independiente, tamb existe ExtractTextPlugin
            filename: '[name].css',
            ignoreOrder: false //para evitar warnings
        })
    ],
    /**
        tambien se permite la configuracion de un server en webpack, aunque en los script 
        se puede realizar el llamado tambien
        esto ayudara para cuando se realicen los cambios en el desarrollo se actualicen en el 
        /dist y se vean los cambios inmediatos, con un server escuchando
     *//*
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        host: '0.0.0.0' //o puede ser 'localhost'
    }*/

}

