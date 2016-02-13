import myo as libmyo
from vars import myPath
libmyo.init(myPath)
feed = libmyo.device_listener.Feed()
hub = libmyo.Hub()
hub.run(1000, feed)
try:
    myo = feed.wait_for_single_device(timeout=10.0)  # seconds
    if not myo:
        print("No Myo connected after 10 seconds.")
        sys.exit()
    if hub.running and myo.connected:
        quat = myo.orientation
        firstX = quat.x
        firstY = quat.y
        firstZ = quat.z
        YReset = False
    while hub.running and myo.connected:
        quat = myo.orientation
        if (quat.x - firstX > 0.2 and not YReset):
            YReset = True
            print("down")
        if (quat.x - firstX < 0.2 and YReset):
            YReset = False
            print("reset")
        #print("Orientation:", round(quat.w, 3), round(quat.y, 3), round(quat.z, 3))
except KeyboardInterrupt:
    print("Quitting...")
finally:
    hub.shutdown()