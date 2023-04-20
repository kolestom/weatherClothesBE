import { Pref, PrefType } from "../models/PrefSchema";
import { UserType } from "../models/UserSchema";

const prefValidatorUpdate = async(request: PrefType, user:UserType, requestID: string): Promise<boolean> => {
    
    const prevPrefs = await Pref.find({
        $and: [
            {userSub: user.sub},
            {_id: {$ne: requestID}},
            {$or: [
                {$and:[
                    {maxTemp: {$lte: request.maxTemp}},
                    {maxTemp: {$gte: request.minTemp}}
                ]},
                {$and:[
                    {minTemp: {$lte: request.maxTemp}},
                    {minTemp: {$gte: request.minTemp}}
                ]},
                {$and:[
                    {maxTemp: {$gte: request.maxTemp}},
                    {minTemp: {$lte: request.minTemp}}
                ]}
        ]}]
    });
    return prevPrefs.length ?  false :  true;
}
 
export default prefValidatorUpdate;