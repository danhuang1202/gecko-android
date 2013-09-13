/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Check tab attach/navigation.
 */

const TAB1_URL = EXAMPLE_URL + "doc_empty-tab-01.html";
const TAB2_URL = EXAMPLE_URL + "doc_empty-tab-02.html";

let gClient;

function test() {
  if (!DebuggerServer.initialized) {
    DebuggerServer.init(() => true);
    DebuggerServer.addBrowserActors();
  }

  let transport = DebuggerServer.connectPipe();
  gClient = new DebuggerClient(transport);
  gClient.connect((aType, aTraits) => {
    is(aType, "browser",
      "Root actor should identify itself as a browser.");

    addTab(TAB1_URL)
      .then(() => attachTabActorForUrl(gClient, TAB1_URL))
      .then(testNavigate)
      .then(testDetach)
      .then(finish)
      .then(null, aError => {
        ok(false, "Got an error: " + aError.message + "\n" + aError.stack);
      });
  });
}

function testNavigate() {
  let outstanding = [promise.defer(), promise.defer()];

  gClient.addListener("tabNavigated", function onTabNavigated(aEvent, aPacket) {
    is(aPacket.url, TAB2_URL,
      "Got a tab navigation notification.");

    if (aPacket.state == "start") {
      ok(true, "Tab started to navigate.");
      outstanding[0].resolve();
    } else {
      ok(true, "Tab finished navigating.");
      gClient.removeListener("tabNavigated", onTabNavigated);
      outstanding[1].resolve();
    }
  });

  gBrowser.selectedTab.linkedBrowser.loadURI(TAB2_URL);
  return promise.all(outstanding.map(e => e.promise));
}

function testDetach() {
  let deferred = promise.defer();

  gClient.addOneTimeListener("tabDetached", () => {
    ok(true, "Got a tab detach notification.");
    gClient.close(deferred.resolve);
  });

  removeTab(gBrowser.selectedTab);
  return deferred.promise;
}

registerCleanupFunction(function() {
  gClient = null;
});
