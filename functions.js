import { global, vues, save } from './vars.js';
import { loc } from './locale.js';
import { races } from './races.js';

export function mainVue(){
    let settings = {
        el: '#mainColumn div:first-child',
        data: { 
            s: global.settings,
            rq: global.r_queue
        },
        methods: {
            lChange(){
                global.settings.locale = $('#localization select').children("option:selected").val();
                save.setItem('evolved',LZString.compressToUTF16(JSON.stringify(global)));
                window.location.reload();
            },
            dark(){
                global.settings.theme = 'dark';
                $('html').removeClass();
                $('html').addClass('dark');
            },
            light(){
                global.settings.theme = 'light';
                $('html').removeClass();
                $('html').addClass('light');
            },
            night(){
                global.settings.theme = 'night';
                $('html').removeClass();
                $('html').addClass('night');
            },
            redgreen(){
                global.settings.theme = 'redgreen';
                $('html').removeClass();
                $('html').addClass('redgreen');
            },
            keys(){
                return loc('settings1');
            },
            animation(){
                return loc('settings2');
            },
            hard(){
                return loc('settings3');
            },
            soft(){
                return loc('settings4');
            },
            remove(index){
                global.r_queue.queue.splice(index,1);
            }
        },
        filters: {
            namecase(name){
                return name.replace(/(?:^|\s)\w/g, function(match) {
                    return match.toUpperCase();
                });
            },
            label(lbl){
                switch (lbl){
                    case 'city':
                        if (global.resource[global.race.species]){
                            if (global.resource[global.race.species].amount <= 5){
                                return loc('tab_city1');
                            }
                            else if (global.resource[global.race.species].amount <= 20){
                                return loc('tab_city2');
                            }
                            else if (global.resource[global.race.species].amount <= 75){
                                return loc('tab_city3');
                            }
                            else if (global.resource[global.race.species].amount <= 250){
                                return loc('tab_city4');
                            }
                            else if (global.resource[global.race.species].amount <= 600){
                                return loc('tab_city5');
                            }
                            else if (global.resource[global.race.species].amount <= 1200){
                                return loc('tab_city6');
                            }
                            else if (global.resource[global.race.species].amount <= 2500){
                                return loc('tab_city7');
                            }
                            else {
                                return loc('tab_city8');
                            }
                        }
                        else {
                            return loc('tab_city1');
                        }
                    case 'local_space':
                        return loc('sol_system',[races[global.race.species].name]);
                    case 'old':
                        return loc('tab_old_res');
                    case 'new':
                        return loc('tab_new_res');
                    case 'old_sr':
                        return loc('tab_old_sr_res');
                    case 'new_sr':
                        return loc('tab_new_sr_res');
                    default:
                        return loc(lbl);
                }
            }
        }
    }
    vues['vue_tabs'] = new Vue(settings);
}

export function timeCheck(c_action,track){
    if (c_action.cost){
        let time = 0;
        Object.keys(c_action.cost).forEach(function (res){
            var testCost = Number(c_action.cost[res]()) || 0;
            let res_have = Number(global.resource[res].amount);
            if (track){
                res_have += global.resource[res].diff * track.t;
                if (track.r[res]){
                    res_have -= Number(track.r[res]);
                    track.r[res] += testCost;
                }
                else {
                    track.r[res] = testCost;
                }
                if (global.resource[res].max >= 0 && res_have > global.resource[res].max){
                    res_have = global.resource[res].max;
                }
            }
            if (testCost > res_have && global.resource[res].diff > 0){
                let r_time = (testCost - res_have) / global.resource[res].diff;
                if (r_time > time){
                    time = r_time;
                }
            }
        });
        if (track){
            track.t += time;
        }
        return time;
    }
    else {
        return 0;
    }
}

export function timeFormat(time){
    let formatted;
    if (time < 0){
        formatted = 'Never';
    }
    else {
        time = +(time.toFixed(0));
        if (time > 60){
            let secs = time % 60;
            let mins = (time - secs) / 60;
            if (mins >= 60){
                let r = mins % 60;
                let hours = (mins - r) / 60;
                if (hours > 24){
                    r = hours % 24;
                    let days = (hours - r) / 24;
                    formatted = `${days}d ${r}h`;
                }
                else {
                    formatted = `${hours}h ${r}m`;
                }
            }
            else {
                formatted = `${mins}m ${secs}s`;
            }
        }
        else {
            formatted = `${time}s`;
        }
    }
    return formatted;
}
