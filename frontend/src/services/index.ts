import { UserService } from '@/services/UserService';
import { ApiService } from '@/services/ApiService';
import { UserAnnouncementService } from './UserAnnouncementService';
import { LoginService } from './LoginService';
import { RegistrationService } from './RegistrationService';
import { EmailCodeService } from './EmailCodeService';
import { ChatParticipantService } from './ChatParticipantService';
import HouseAnnouncementService from './HouseAnnouncementService';

export const userService = new UserService(ApiService);

export const userAnnouncementService = new UserAnnouncementService(ApiService);

export const loginService = new LoginService(ApiService);

export const registrationService = new RegistrationService(ApiService);

export const emailCodeService = new EmailCodeService(ApiService);

export const chatParticipantService = new ChatParticipantService(ApiService);

export const houseAnnouncementService = new HouseAnnouncementService(
    ApiService
);
