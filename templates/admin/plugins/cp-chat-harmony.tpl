<div class="row">
  <div class="col-lg-9">
    <div class="panel panel-default cp-chat-harmony-admin">
      <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-comments"></i> [[cp-chat-harmony:admin.title]]</h3>
      </div>
      <div class="panel-body">
        <form role="form" class="cp-chat-harmony-settings">
          <div class="form-group">
            <label><input type="checkbox" data-field="enabled" /> [[cp-chat-harmony:admin.enabled]]</label>
            <p class="help-block">[[cp-chat-harmony:admin.enabled.help]]</p>
          </div>

          <div class="form-group">
            <label for="chatPathPattern">[[cp-chat-harmony:admin.chatPathPattern]]</label>
            <input id="chatPathPattern" type="text" class="form-control" data-field="chatPathPattern" placeholder="/chats" />
            <p class="help-block">[[cp-chat-harmony:admin.chatPathPattern.help]]</p>
          </div>

          <hr />
          <h4>[[cp-chat-harmony:admin.bridge]]</h4>

          <div class="form-group">
            <label for="bridgeBaseUrl">[[cp-chat-harmony:admin.bridgeBaseUrl]]</label>
            <input id="bridgeBaseUrl" type="url" class="form-control" data-field="bridgeBaseUrl" placeholder="https://im.example.com/bridge" />
            <p class="help-block">[[cp-chat-harmony:admin.bridgeBaseUrl.help]]</p>
          </div>

          <div class="form-group">
            <label for="bridgeApiKey">[[cp-chat-harmony:admin.bridgeApiKey]]</label>
            <input id="bridgeApiKey" type="password" class="form-control" data-field="bridgeApiKey" autocomplete="new-password" />
          </div>

          <div class="form-group">
            <label for="wkSdkUrl">[[cp-chat-harmony:admin.wkSdkUrl]]</label>
            <input id="wkSdkUrl" type="url" class="form-control" data-field="wkSdkUrl" />
          </div>

          <div class="form-group">
            <label for="wkWsUrl">[[cp-chat-harmony:admin.wkWsUrl]]</label>
            <input id="wkWsUrl" type="text" class="form-control" data-field="wkWsUrl" placeholder="wss://example.com/wkws/" />
          </div>

          <hr />
          <h4>[[cp-chat-harmony:admin.defaults]]</h4>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="defaultSourceLang">[[cp-chat-harmony:admin.defaultSourceLang]]</label>
                <input id="defaultSourceLang" class="form-control" data-field="defaultSourceLang" />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="defaultTargetLang">[[cp-chat-harmony:admin.defaultTargetLang]]</label>
                <input id="defaultTargetLang" class="form-control" data-field="defaultTargetLang" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="maxPersistMessages">[[cp-chat-harmony:admin.maxPersistMessages]]</label>
                <input id="maxPersistMessages" type="number" min="50" max="1000" class="form-control" data-field="maxPersistMessages" />
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="maxTotalMessagesInMemory">[[cp-chat-harmony:admin.maxTotalMessagesInMemory]]</label>
                <input id="maxTotalMessagesInMemory" type="number" min="300" max="2000" class="form-control" data-field="maxTotalMessagesInMemory" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label><input type="checkbox" data-field="lazyLoadEngine" /> [[cp-chat-harmony:admin.lazyLoadEngine]]</label>
          </div>
          <div class="form-group">
            <label><input type="checkbox" data-field="enableSmartReply" /> [[cp-chat-harmony:admin.enableSmartReply]]</label>
          </div>
          <div class="form-group">
            <label><input type="checkbox" data-field="autoTranslateLastMsg" /> [[cp-chat-harmony:admin.autoTranslateLastMsg]]</label>
          </div>
          <div class="form-group">
            <label><input type="checkbox" data-field="debug" /> [[cp-chat-harmony:admin.debug]]</label>
          </div>
        </form>
      </div>
      <div class="panel-footer">
        <button class="btn btn-primary" id="save"><i class="fa fa-save"></i> [[cp-chat-harmony:admin.save]]</button>
      </div>
    </div>
  </div>
  <div class="col-lg-3">
    <div class="panel panel-info">
      <div class="panel-heading">[[cp-chat-harmony:admin.notes]]</div>
      <div class="panel-body">
        <p>[[cp-chat-harmony:admin.notes.text]]</p>
        <code>./nodebb build &amp;&amp; ./nodebb restart</code>
      </div>
    </div>
  </div>
</div>
