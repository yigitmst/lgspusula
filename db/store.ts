import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw new Error('Çalışma kayıtlarına şu anda erişilemiyor.');return env.DB;}
