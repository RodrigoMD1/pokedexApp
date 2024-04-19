
export const EnvConfiguration = () => ({

    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3002,
    defaultLimit: +process.env.DEFAULT_LIMIT || 7, 

    // ** esto es para cuando no se configura el .env y que ya tenga seteado una configuracion predeterminada por ejemplo en el env en DEFAULT_LIMIT = 5 si no lo configuro eso si no lo escribo va tomar el 7 de defaultlimit de aca y asi con el resto :)  

})