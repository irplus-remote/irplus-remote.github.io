/*Author: binarymode.android@gmail.com
   MIT-Licence
   You will need to install this library on your PC before compiling this sketch:
   https://github.com/Arduino-IRremote/Arduino-IRremote
   Tested with 3.3.0 Installed with Tools -> Manage Library
*/

#include "BluetoothSerial.h"
#include <IRremote.h>

#include <stdio.h>
#include <stdlib.h>


//-----------------------------------------------------------------
BluetoothSerial SerialBT;
int dataPosition = 0;
const int dataUpperLimit = 300;
byte dataBytes[dataUpperLimit];
//-----------------------------------------------------------------
void setup() {
  //Serial.begin(9600);//Enable/disable console serial
  Serial.begin(9600);
  SerialBT.begin("irplusESP32"); //Bluetooth device name
  //WARNING: USE THE CORRECT GPIO PIN. HERE 17 IS USED!
  IrSender.begin(17, true); // Specify send pin and enable feedback LED at default feedback LED pin
}
//-------------------------------------------------------------------
void loop() {
  if (SerialBT.available() > 0) {
    dataBytes[dataPosition] = SerialBT.read();
    //stop reading at this point
    if (dataPosition > 0 && (dataPosition % 2) != 0 && dataBytes[dataPosition - 1] == 255 && dataBytes[dataPosition] == 255) {
      //create array
      short unsigned int carrierFrequency = 0;
      short unsigned int dataBuffer[(dataPosition / 2) - 1];
      int byteCounter = 0;
      for (int i = 0; i < dataPosition / 2; i++) {
        int currentInt = word(dataBytes[byteCounter + 1], dataBytes[byteCounter]);
        if (i == 0) {
          carrierFrequency = currentInt;
        } else {
          dataBuffer[i - 1] = currentInt;
        }
        byteCounter = byteCounter + 2;
      }
      //send IR
   
      int carrierKhz = carrierFrequency / 1000;

      IrSender.sendRaw(dataBuffer, sizeof(dataBuffer) / sizeof(dataBuffer[0]), carrierKhz); // Note the approach used to automatically calculate the size of the array.

      //reset reading data
      dataPosition = 0;
      memset(dataBytes, 0, dataUpperLimit);
      SerialBT.write(1);

    } else {
      dataPosition++;
    }
  }
}
