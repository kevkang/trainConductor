import myo as libmyo
import math
from vars import myPath

libmyo.init(myPath)
feed = libmyo.device_listener.Feed()
hub = libmyo.Hub()
hub.run(1000, feed)

def toDeg(rad):
    return round(rad*180/math.pi, 3)

def toEuler(quat):
    roll = toDeg(math.atan2(2.0 * (quat.w * quat.x + quat.y * quat.z),\
        1.0 - 2.0 * (quat.x * quat.x + quat.y * quat.y)))
    pitch = toDeg(math.asin(max(-1.0,min(1.0, 2.0 * (quat.w * quat.y - quat.z * quat.x)))))
    yaw = toDeg(math.atan2(2.0 * (quat.w * quat.z + quat.x * quat.y),\
        1.0 - 2.0 * (quat.y * quat.y + quat.z * quat.z)))

    return {"roll":roll,"pitch":pitch,"yaw":yaw}

count = 0

try:
    myo = feed.wait_for_single_device(timeout=10.0)  # seconds
    if not myo:
        print("No Myo connected after 10 seconds.")
        sys.exit()

    while hub.running and myo.connected:
        quat = myo.orientation
        accel = myo.acceleration
        euler = toEuler(quat)
        av = myo.getGyro()
        
        print("Accel:","x:",round(av.x,3),"\ty:",round(av.y,3),"\tz:",round(av.z,3))
        # if (accel.z > 1):
        #     count += 1
        #     print(str(count))
            
        
        # print("Roll:",euler["roll"],\
        #     "Pitch:",euler["pitch"],\
        #     "Yaw:",euler["yaw"])
        # print("Orientation:",\
        #     "x:",toDeg(quat.x),\
        #     "y:",toDeg(quat.y),\
        #     "z:",toDeg(quat.z),\
        #     "w:",toDeg(quat.w))
except KeyboardInterrupt:
    print("Quitting...")
finally:
    hub.shutdown()
