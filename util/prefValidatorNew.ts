import { Pref, PrefType } from "../models/PrefSchema";
import { UserType } from "../models/UserSchema";

const prefValidatorNew = async(request: PrefType, user:UserType): Promise<boolean> => {
    
    const prevPrefs = await Pref.find<PrefType>({
        $and: [
            {userSub: user.sub},
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
 
export default prefValidatorNew;