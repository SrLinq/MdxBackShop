import { userRepository } from "./userDB";

export class userService {
    constructor() {
        this.userRepository = userRepository;
    }
    
}