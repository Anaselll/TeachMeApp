import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";

function randomID(len = 5) {
  let result = "";
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function VideoCall() {
  const { roomID } = useParams();
  const room = roomID || randomID(5); // ✅ Use provided roomID or generate one
  const callContainerRef = React.useRef(null);

  React.useEffect(() => {
    const initCall = async () => {
      const appID = 215132432;
      const serverSecret = "2bd41e3b5fbe39c8ccfdf771abf1f28e";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        room,
        randomID(5),
        randomID(5)
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: callContainerRef.current,
        sharedLinks: [
          {
            name: "Personal link",
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${room}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // ✅ One-on-One Tutor Mode
        },
        showScreenSharingButton: true, // ✅ Enables Screen Sharing
      });
    };

    initCall();
  }, [room]); // Runs when room changes

  return (
    <div
      ref={callContainerRef} // ✅ Attach ref for Zego UIKit
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
