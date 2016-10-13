(function(hbs){
    hbs.registerPartial('router', '{{#each this}}{{#if_equal TEMPLATE "router"}}{{>router this}}{{/if_equal}}{{#if_equal TEMPLATE "table_tag"}}{{>table-tag this}}{{/if_equal}}{{#if_equal TEMPLATE "table"}}{{>table-2 this}}{{/if_equal}}{{#if_equal TEMPLATE "tag"}}{{>tag this}}{{/if_equal}}{{#if_equal TEMPLATE "ctrl"}}{{>ctrl this}}{{/if_equal}}{{/each}}')
    
    hbs.registerPartial('tag', '<div class="vj-table vj-tag-table" data-name="{{@key}}" data-group="{{GROUP}}" ><div class="vj-tag-container"><span data-vj-tag  class="vj-tag-name">未命名</span><span class="vj-tag-add"></span></div><div class="vj-tab-container"><div data-vj-tab >{{>router this}}</div></div></div>')

    // hbs.registerPartial('tag', '<div class="vj-table vj-tag-table" data-name="{{@key}}" data-group="{{@../../key}}" ><div class="vj-tag-container"><span data-vj-tag  class="vj-tag-name">未命名</span><span class="vj-tag-add"></span></div><div class="vj-tab-container"><div data-vj-tab >{{>router this}}</div></div></div>')

    hbs.registerPartial('table', '<tr data-name="{{@key}}" data-group="{{GROUP}}"><td class="vj-name"><span class="vj-title">{{TITLE}}</span><lable>{{@key}}</lable></td><td>{{>router this}}</td></tr>')
    
    hbs.registerPartial('table-2', '<div class="vj-table-row" data-name="{{@key}}" data-group="{{GROUP}}"><div class="vj-table-hd">{{TITLE}}</div><div class="vj-table-bd">{{>router this}}</div></div>')

    hbs.registerPartial('table-tag', '<div class="vj-table-row" data-name="{{@key}}" data-group="{{GROUP}}"><div class="vj-table-hd">{{TITLE}}</div><div class="vj-table-bd"><div class="vj-table vj-tag-table" data-name="{{@key}}" data-group="{{GROUP}}" ><div class="vj-tag-container"><span data-vj-tag  class="vj-tag-name">未命名</span><span class="vj-tag-add"></span></div><div class="vj-tab-container"><div data-vj-tab >{{>router this}}</div></div></div></div></div>')

    hbs.registerPartial('ctrl','{{#INPUT}}<div class="vj-ctrl vj-ctrl-input {{CLASS}}" data-name="{{@key}}" data-group="{{../GROUP}}"><span class="vj-title">{{TITLE}}</span>{{#if ITEM}}{{#each ITEM}}<div class="vj-item" data-name="{{@key}}" data-index="{{@index}}">{{#or VIEWER ../../VIEWER}}<span class="vj-viewer">{{this}}</span>{{/or}}{{#or TEXT ../../TEXT}}<span class="vj-text">{{this}}</span>{{/or}}{{#or PLACEHOLDER ../../PLACEHOLDER}}<span class="vj-placeholder">{{this}}</span>{{/or}}{{#or COUNTER ../../COUNTER}}<span class="vj-counter">{{this}}</span>{{/or}}{{#or UNIT ../../UNIT}}<span class="vj-unit">{{this}}</span>{{/or}}{{#if_equal INPUT "textarea"}}<textarea class="vj-input" {{#or STYLE../../STYLE}}style="{{this}}"{{/or}}></textarea>{{else}}<input type="text" class="vj-input" {{#or STYLE../../STYLE}}style="{{this}}"{{/or}}>{{/if_equal}}</div>{{/each}}<p class="vj-desc" style="margin-left:82px"><span class="vj-err"></span><span>{{{DESC}}}</span></p>{{else}}<div class="vj-item">{{#if VIEWER}}<span class="vj-viewer">{{VIEWER}}</span>{{/if}}{{#if TEXT}}<span class="vj-text">{{TEXT}}</span>{{/if}}{{#if PLACEHOLDER}}<span class="vj-placeholder">{{PLACEHOLDER}}</span>{{/if}}{{#if COUNTER}}<span class="vj-counter">{{COUNTER}}</span>{{/if}}{{#if UNIT}}<span class="vj-unit">{{UNIT}}</span>{{/if}}{{#if_equal INPUT "textarea"}}<textarea class="vj-input" {{#STYLE}}style="{{this}}"{{/STYLE}}></textarea>{{else}}<input type="text" class="vj-input" {{#STYLE}}style="{{this}}"{{/STYLE}}>{{/if_equal}}<p class="vj-desc"><span class="vj-err"></span><span>{{{DESC}}}</span></p></div>{{/if}}</div>{{/INPUT}}{{#SELECT}}<div class="vj-ctrl vj-ctrl-select {{CLASS}}" data-name="{{@key}}" data-group="{{../GROUP}}"><span class="vj-title">{{TITLE}}</span><div class="vj-item"><div class="vj-select"><span class="vj-viewer">{{VIEWER}}</span><span class="vj-text">{{TEXT}}</span><div class="vj-select-list">{{#each ITEM}}<span class="vj-li" data-value="{{@key}}" {{../ITEM_ATTR}}>{{this}}</span>{{/each}}</div></div><p class="vj-desc"><span class="vj-err"></span><span>{{{DESC}}}</span></p></div></div>{{/SELECT}}{{#CHECK}}<div class="vj-ctrl vj-ctrl-check {{CLASS}}" data-name="{{@key}}" data-group="{{../GROUP}}"><span class="vj-title">{{TITLE}}</span><div class="vj-item">{{#if ITEM}}{{#each ITEM}}<span class="vj-li vj-check" data-value="{{@key}}" {{../ITEM_ATTR}}>{{this}}</span>{{/each}}{{else}}{{#each BOOL}}<span class="vj-li vj-check" data-name="{{@key}}" data-index="{{@index}}" {{../ITEM_ATTR}}>{{this}}</span>{{/each}}{{/if}}<p class="vj-desc"><span class="vj-err"></span><span>{{{DESC}}}</span></p></div></div>{{/CHECK}}<br>');
    
    hbs.registerHelper('if_equal', function(val1, val2, options) {
        if( val1 === val2 ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    hbs.registerHelper('or', function(val1, val2, options) {
        return val1 || val2? options.fn(val1 || val2) : options.inverse(this);
    });

})(Handlebars)

// MIN REG ([\r\n])|([\s]{2,})
/* --CTRL--

{{#INPUT}}
<div class="vj-ctrl vj-ctrl-input {{CLASS}}" data-name="{{@key}}" data-group="{{../GROUP}}">
    <span class="vj-title">{{TITLE}}</span>
    {{#if ITEM}}
        {{#each ITEM}}
            <div class="vj-item" data-name="{{@key}}" data-index="{{@index}}">
                {{#or VIEWER ../../VIEWER}}<span class="vj-viewer">{{this}}</span>{{/or}}
                {{#or TEXT ../../TEXT}}<span class="vj-text">{{this}}</span>{{/or}}
                {{#or PLACEHOLDER ../../PLACEHOLDER}}<span class="vj-placeholder">{{this}}</span>{{/or}}
                {{#or COUNTER ../../COUNTER}}<span class="vj-counter">{{this}}</span>{{/or}}
                {{#or UNIT ../../UNIT}}<span class="vj-unit">{{this}}</span>{{/or}}

                {{#if_equal INPUT "textarea"}}
                    <textarea class="vj-input" {{#or STYLE  ../../STYLE}}style="{{this}}"{{/or}}></textarea>
                {{else}}
                    <input type="text" class="vj-input" {{#or STYLE  ../../STYLE}}style="{{this}}"{{/or}}>
                {{/if_equal}}
            </div>
        {{/each}}
        <p class="vj-desc" style="margin-left:82px">
            <span class="vj-err"></span>
            <span>{{{DESC}}}</span>
        </p>
    {{else}}
        <div class="vj-item">
            {{#if VIEWER}}<span class="vj-viewer">{{VIEWER}}</span>{{/if}}
            {{#if TEXT}}<span class="vj-text">{{TEXT}}</span>{{/if}}
            {{#if PLACEHOLDER}}<span class="vj-placeholder">{{PLACEHOLDER}}</span>{{/if}}
            {{#if COUNTER}}<span class="vj-counter">{{COUNTER}}</span>{{/if}}
            {{#if UNIT}}<span class="vj-unit">{{UNIT}}</span>{{/if}}

            {{#if_equal INPUT "textarea"}}
                <textarea class="vj-input" {{#STYLE}}style="{{this}}"{{/STYLE}}></textarea>
            {{else}}
                <input type="text" class="vj-input" {{#STYLE}}style="{{this}}"{{/STYLE}}>
            {{/if_equal}}
            <p class="vj-desc">
                <span class="vj-err"></span>
                <span>{{{DESC}}}</span>
            </p>
        </div>
    {{/if}}
</div>
{{/INPUT}}

{{#SELECT}}
<div class="vj-ctrl vj-ctrl-select {{CLASS}}" data-name="{{@key}}" data-group="{{../GROUP}}">
    <span class="vj-title">{{TITLE}}</span>
    <div class="vj-item">
        <div class="vj-select">
            <span class="vj-viewer">{{VIEWER}}</span>
            <span class="vj-text">{{TEXT}}</span>
            <div class="vj-select-list">
                {{#each ITEM}}
                    <span class="vj-li" data-value="{{@key}}" {{../ITEM_ATTR}}>{{this}}</span>
                {{/each}}
            </div>
        </div>
        <p class="vj-desc">
            <span class="vj-err"></span>
            <span>{{{DESC}}}</span>
        </p>
    </div>
</div>
{{/SELECT}}

{{#CHECK}}
<div class="vj-ctrl vj-ctrl-check {{CLASS}}" data-name="{{@key}}" data-group="{{../GROUP}}">
    <span class="vj-title">{{TITLE}}</span>
    <div class="vj-item">
        {{#if ITEM}}
            {{#each ITEM}}<span class="vj-li vj-check" data-value="{{@key}}" {{../ITEM_ATTR}}>{{this}}</span>{{/each}}
        {{else}}
            {{#each BOOL}}<span class="vj-li vj-check" data-name="{{@key}}" data-index="{{@index}}" {{../ITEM_ATTR}}>{{this}}</span>{{/each}}
        {{/if}}
        <p class="vj-desc">
            <span class="vj-err"></span>
            <span>{{{DESC}}}</span>
        </p>
    </div>
</div>
{{/CHECK}}
<br>



*/