import { Elysia, t } from "elysia";
import { conversationRoutes } from "./conversationRoutes";
import { messageRoutes } from "./messageRoutes";
import { reactionRoutes } from "./reactionRoutes";
import { reactionTypeRoutes } from "./reactionTypeRoutes";

export const slackRoutes = (app: Elysia) => app.group(
    '/api/v1/slack', (app) => app
        /*
        Ked som nestoval routy, napr ze 'api/v1/slack/conversation/:conversationId/messages/:messagesId/reactions/:reactionId/edit 
        prislo mi to neprehladne tak som ich dal vsetky na jednu uroven, ale pri niektorych routach mi ich volanie pride neintuitivne
        a nie som si isty ako by som to mal zmenit bez nestovania. 
        Napr ked chcem vidiet spravy v konverzacii routa je 'api/v1/slack/conversation/messages'
        a momentalne je v kontrolleri pre konverzacie. Ak ale pracujem s konkretnou spravou je to len 'api/v1/slack/messages/:messageId'v kontroleri pre spravy.
        
        Robim to tak kvoli tomu, ze GET request by nemal mat body, cize ak chcem spravy v konverzacii ziskavat cez GET, tak id konverzacie potrebujem v URL.
        Ked chcem ale poslat spravu, pouzivam POST a teda id konverzacie davam do  body requestu. 
        Nie som si isty ci je to spravne alebo nie, kazdopadne by som na to rad vedel odpoved
        */
        .use(conversationRoutes)
        .use(messageRoutes)
        .use(reactionRoutes)
        .use(reactionTypeRoutes)

)

