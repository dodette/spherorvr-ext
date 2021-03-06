
/**
* Use this file to define custom functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="Sphero RVR Extended"
namespace custom {
    export class DriveCommandsExt {
        public static readonly driveToPositionSI: number = 0x38;
        public static readonly driveTankNormalized: number = 0x33;
        public static readonly driveWithYawNormalized: number = 0x37;
    }

    export class Utilities {
        public static floatToByteArray(value: number): Array<number> {
            let buffer: Buffer = Buffer.pack('>f',[value]);
            return buffer.toArray(NumberFormat.Float32BE);
        }
        
        public static int8ToByteArray(value: number): Array<number> {
            return sphero.Utilities.numberToByteArray(value, 1);
        }
    }

    /**
     * Recreate drive function as test
     */
    //% block="drive with speed %speed| and heading %heading|"
    //% help=spheroRvr/drive
    //% speed.min=-255 speed.max=255
    //% heading.min=0 heading.max=359
    //% subcategory=Extension
    export function drive(speed: number, heading: number): void {
        let flags: number = 0x00;
        if (speed < 0) {
            flags = 0x01;
        }

        let messageData: Array<number> = [Math.abs(speed)];
        //let headingArray: Array<number> = sphero.Utilities.int16ToByteArray(heading);
        //let headingArray: Array<number> = Buffer.pack('>h', [heading]).toArray(NumberFormat.Int16BE);

        let headingBuffer: Buffer = Buffer.create(2);
        Buffer.__packUnpackCore('>h',[heading],headingBuffer,true);
        let headingArray: Array<number> = helpers.bufferToArray(headingBuffer,NumberFormat.Int16BE);
        
        for (let i: number = 0; i < headingArray.length; i++) {
            messageData.push(headingArray[i]);
        }

        messageData.push(flags);

        let apiMessage = sphero.buildApiCommandMessageWithDefaultFlags(
            sphero.ApiTargetsAndSources.robotStTarget,
            sphero.ApiTargetsAndSources.serviceSource,
            sphero.DriveCommands.driveDeviceId,
            sphero.DriveCommands.driveWithHeadingCommandId,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    //% block="drive with yaw %yaw| and speed %speed|"
    //% yaw.min=-32767 yaw.max=32767
    //% speed.min=-127 speed.max=127
    export function driveWithYawNormalized (yaw:number,speed:number): void {
        let flags: number = 0x00;

        let messageData: Array<number> = sphero.Utilities.int16ToByteArray(yaw);
        let speedArray: Array<number> = Utilities.int8ToByteArray(speed);

        for (let i: number = 0; i < speedArray.length; i++) {
            messageData.push(speedArray[i]);
        }

        messageData.push(flags);

        let apiMessage = sphero.buildApiCommandMessageWithDefaultFlags(
            sphero.ApiTargetsAndSources.robotStTarget,
            sphero.ApiTargetsAndSources.serviceSource,
            sphero.DriveCommands.driveDeviceId,
            DriveCommandsExt.driveWithYawNormalized,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

    //% block="tank drive %left| velocity %right| velocity"
    //% left.min=-127 left.max=127
    //% right.min=-127 right.max=127
    export function driveTank(left:number, right:number): void {
        let flags: number = 0x00;
        
        let messageData: Array<number> = sphero.Utilities.int16ToByteArray(left);
        let rightArray: Array<number> = sphero.Utilities.int16ToByteArray(right);
        for (let i: number = 0; i < rightArray.length; i++) {
            messageData.push(rightArray[i]);
        }

        messageData.push(flags);

        let apiMessage = sphero.buildApiCommandMessageWithDefaultFlags(
            sphero.ApiTargetsAndSources.robotStTarget,
            sphero.ApiTargetsAndSources.serviceSource,
            sphero.DriveCommands.driveDeviceId,
            DriveCommandsExt.driveTankNormalized,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }

     //% block="drive to ( %x|, %y| ) cm at speed %speed| with heading %heading|"
    //% x.min=0 x.max=500
    //% y.min=0 y.max=500
    //% speed.min=0 speed.max=2
    //% heading.min=0 heading.max=359
    //% subcategory=Extension
    export function driveToPosition(x: number, y: number, speed: number, heading: number): void {
        // For other drive functions, the flag 0x01 is used to indicate reverse. It is not needed
        // to drive to an internal reference position
        let flags: number = 0x00;

        // Convert to cm to m (SI)
        x = x/100;
        y = y/100;

        let messageData: Array<number> = [];
        let headingArray: Array<number> = Utilities.floatToByteArray(heading);
        let xArray: Array<number> = Utilities.floatToByteArray(x);
        let yArray: Array<number> = Utilities.floatToByteArray(y);
        let speedArray: Array<number> = Utilities.floatToByteArray(speed);

        for (let i: number = 0; i < headingArray.length; i++) {
            messageData.push(headingArray[i]);
        }
        for (let i: number = 0; i < xArray.length; i++) {
            messageData.push(xArray[i]);
        }
        for (let i: number = 0; i < yArray.length; i++) {
            messageData.push(yArray[i]);
        }
        for (let i: number = 0; i < speedArray.length; i++) {
            messageData.push(speedArray[i]);
        }

        messageData.push(flags);

        let apiMessage = sphero.buildApiCommandMessageWithDefaultFlags(
            sphero.ApiTargetsAndSources.robotStTarget,
            sphero.ApiTargetsAndSources.serviceSource,
            sphero.DriveCommands.driveDeviceId,
            DriveCommandsExt.driveToPositionSI,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    }
}
