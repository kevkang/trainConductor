import myo as libmyo
import time
from vars import myPath
libmyo.init(myPath)
feed = libmyo.device_listener.Feed()
hub = libmyo.Hub()
hub.run(1000, feed)
fourFourArray = ["down", "left", "right", "up"]

try:
    myo = feed.wait_for_single_device(timeout=10.0)  # seconds
    if not myo:
        print("No Myo connected after 10 seconds.")
        sys.exit()
    if hub.running and myo.connected:
        selectedArray = fourFourArray
        prevAngVel = myo.gyroscope
        prevAccel = myo.acceleration
        i = 0
        stateCounter = 0
        receivedBeat = False
        state = selectedArray[0]
    while hub.running and myo.connected:
        time.sleep(0.01)
        angVel = myo.gyroscope
        prevState = state
        if angVel.z == max(abs(angVel.z), abs(angVel.y)) and angVel.z > 30:
            state = "left"
        elif angVel.y == max(abs(angVel.z), abs(angVel.y)) and angVel.y > 30:
            state = "up"
        elif angVel.z == -max(abs(angVel.z), abs(angVel.y)) and angVel.z < -30:
            state = "right"
        elif angVel.y == -max(abs(angVel.z), abs(angVel.y)) and angVel.y < -30:
            state = "down"
        if prevState != state:
            if not receivedBeat and prevState == selectedArray[i % len(selectedArray)]:
                receivedBeat = True
                print("beat ", i, selectedArray[i % len(selectedArray)], state)
            if state == selectedArray[(i + 1) % len(selectedArray)]:
                i += 1
                receivedBeat = False
            stateCounter = 0
        else:
            stateCounter += 1
except KeyboardInterrupt:
    print("Quitting...")
finally:
    hub.shutdown()