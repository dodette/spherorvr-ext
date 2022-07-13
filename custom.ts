
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
    }

/*     export class Utilities {
        public static floatToByteArray(value: number): Array<number> {
            
            return this.numberToByteArray(value, 4);
        }
    } */

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
        let headingArray: Array<number> = sphero.Utilities.int16ToByteArray(heading);
        
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

    //% block="tank drive %left| velocity %right| velocity"
    //% left.min=-255 left.max=255
    //% right.min=-255 right.max=255
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

/*     //% block="drive to ( %x|, %y| ) cm at speed %speed| with heading %heading|"
    //% x.min=0 x.max=500
    //% y.min=0 y.max=500
    //% speed.min=0 speed.max=2
    //% heading.min=0 heading.max=359
    //% subcategory=Extension
    export function driveToPosition(x: number, y: number, speed: number, heading: number): void {
        // For other drive functions, the flag 0x01 is used to indicate reverse. It is not needed
        // to drive to an internal reference position
        let flags: number = 0x00;

        x = x/100;
        y = y/100;

        let messageData: Array<number> = [];
        let headingArray: Array<number> = sphero.Utilities.int16ToByteArray(heading);
        let xArray: Array<number> = sphero.Utilities.int32ToByteArray(x/100);
        let yArray: Array<number> = sphero.Utilities.int32ToByteArray(y/100);

        for (let i: number = 0; i < headingArray.length; i++) {
            messageData.push(headingArray[i]);
        }

        messageData.push(x);
        messageData.push(y);
        messageData.push(Math.abs(speed));

        messageData.push(flags);

        let apiMessage = sphero.buildApiCommandMessageWithDefaultFlags(
            sphero.ApiTargetsAndSources.robotStTarget,
            sphero.ApiTargetsAndSources.serviceSource,
            sphero.DriveCommands.driveDeviceId,
            DriveCommandsExt.driveToPositionSI,
            messageData
        );

        serial.writeBuffer(pins.createBufferFromArray(apiMessage.messageRawBytes));
    } */
}
