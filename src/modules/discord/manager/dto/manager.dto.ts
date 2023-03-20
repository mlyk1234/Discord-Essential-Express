import { IsString, IsUrl } from "class-validator";

export class guildManagerDto {

    @IsString()
    guild_name: string;

    @IsString()
    guild_id: string;

    @IsUrl()
    guild_link: string;
}