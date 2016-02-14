import myo as libmyo
import time
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
        orignalAngVel = myo.gyroscope
        goingUp = True
        downbeatDiff = 0
        """
        quat = myo.orientation
        firstX = quat.x
        firstY = quat.y
        firstZ = quat.z
        xDown = False
        xUp = False
        yLeft = False
        yRight = False
        zLeft = False
        zRight = False
        print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
        """
    while hub.running and myo.connected:
        angVel = myo.gyroscope
        accel = myo.acceleration
        time.sleep(1)
        print("angular Velocity: ", round(angVel.z,1))  
        print("acceleration: ", round(accel.y, 2)) 
        
        downbeatDiff = angVel.x
        """
        quat = myo.orientation
        //below is code based on quaternion
        if (abs(quat.x - firstX) > 0.2) and (not xDown) and (not xUp):
            if (quat.x - firstX < 0.2):  
                xDown = True
                xUp = False
                print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
                print("down")
            else:
                xUp = True
                xDown = False
                print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
                print("up")
        if (abs(quat.x - firstX) < 0.2) and (xDown or xUp):
            xDown = False
            xUp = False
            print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
            print("vertical centered")
        if (abs(quat.z - firstZ) > 0.2) and (not zLeft) and (not zRight):
            if (quat.z - firstZ < 0.2):  
                zLeft = True
                zRight = False
                print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
                print("left")
            else:
                zRight = True
                zLeft = False
                print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
                print("right")
        if (abs(quat.z - firstZ) < 0.2) and (zLeft or zRight):
            zLeft = False
            zRight = False
            print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
            print("horiz centered")
        #print("Orientation:", round(quat.x, 3), round(quat.y, 3), round(quat.z, 3), round(quat.w, 3))
        """
except KeyboardInterrupt:
    print("Quitting...")
finally:
    hub.shutdown()