import {auth} from 'express-oauth2-jwt-bearer'
import dotenv from 'dotenv';
dotenv.config();


const jwtCheck = auth({ 
    audience:"http://localhost:8000",
    issuerBaseURL:"https://dev-0c6ttoypv2r72y7h.us.auth0.com",
    tokenSigningAlg: "RS256"
})


export default jwtCheck