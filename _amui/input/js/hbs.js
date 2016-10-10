(function(hbs){
    hbs.registerPartial('router', '{{#each this}}{{#if_equal TEMPLATE "router"}}{{>router this}}{{/if_equal}}{{#if_equal TEMPLATE "table"}}{{>table-2 this}}{{/if_equal}}{{#if_equal TEMPLATE "tag"}}{{>tag this}}{{/if_equal}}{{#if_equal TEMPLATE "ctrl"}}{{>ctrl this}}{{/if_equal}}{{/each}}')
    
    hbs.registerPartial('tag', '<div class="vj-table vj-tag-table" data-name="{{@key}}" data-group="{{@../../key}}" ><div class="vj-tag-container"><span data-vj-tag  class="vj-tag-name">未命名</span><span class="vj-tag-add"></span></div><div class="vj-tab-container"><div data-vj-tab >{{>router this}}</div></div></div>')

    hbs.registerPartial('table', '<tr data-name="{{@key}}" data-group="{{GROUP}}"><td class="vj-name"><span class="vj-title">{{TITLE}}</span><lable>{{@key}}</lable></td><td>{{>router this}}</td></tr>')
    
    hbs.registerPartial('table-2', '<div class="vj-table-row" data-name="{{@key}}" data-group="{{GROUP}}"><div class="vj-table-hd">{{TITLE}}</div><div class="vj-table-bd">{{>router this}}</div></div>')

    hbs.registerPartial('ctrl','{{#INPUT}}<div class="vj-ctrl vj-ctrl-input {{CLASS}}" data-name="{{@key}}" data-group="{{@../key}}"><span class="vj-title">{{TITLE}}</span><div class="vj-item">{{#if VIEWER}}<span class="vj-viewer">{{VIEWER}}</span>{{/if}}{{#if TEXT}}<span class="vj-text">{{TEXT}}</span>{{/if}}{{#if PLACEHOLDER}}<span class="vj-placeholder">{{PLACEHOLDER}}</span>{{/if}}{{#if COUNTER}}<span class="vj-counter">{{COUNTER}}</span>{{/if}}{{#if UNIT}}<span class="vj-unit">{{UNIT}}</span>{{/if}}{{#if_equal INPUT "input"}}<input type="text" class="vj-input">{{/if_equal}}{{#if_equal INPUT "textarea"}}<textarea class="vj-input"></textarea>{{/if_equal}}</div><p class="vj-desc"><span class="vj-err"></span><span>{{DESC}}</span></p></div>{{/INPUT}}{{#SELECT}}<div class="vj-ctrl vj-ctrl-select {{CLASS}}" data-name="{{@key}}" data-group="{{@../key}}"><span class="vj-title">{{TITLE}}</span><div class="vj-item">{{#if VIEWER}}<span class="vj-viewer">{{VIEWER}}</span>{{/if}}{{#if TEXT}}<span class="vj-text">{{TEXT}}</span>{{/if}}<div class="vj-select">{{#each ITEM}}<span data-vj-data="{{@key}}">{{this}}</span>{{/each}}</div></div><p class="vj-desc"><span class="vj-err"></span><span>{{DESC}}</span></p></div>{{/SELECT}}{{#CHECK}}<div class="vj-ctrl vj-ctrl-check {{CLASS}}" data-name="{{@key}}" data-group="{{@../key}}"><span class="vj-title">{{TITLE}}</span><div class="vj-item">{{#each ITEM}}<span data-vj-data="{{@key}}" class="vj-check">{{this}}</span>{{/each}}</div><p class="vj-desc"><span class="vj-err"></span><span>{{DESC}}</span></p></div>{{/CHECK}}<br>');
    
    hbs.registerHelper('if_equal', function(val1, val2, options) {
        if( val1 === val2 ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

})(Handlebars)