/*Author: binarymode.android@gmail.com
 * MIT-Licence
 * You will need to install this library on your PC before compiling this sketch:
 * https://github.com/z3t0/Arduino-IRremote
 */
#include <SoftwareSerial.h>
#include <IRremote.h>
#include <stdio.h>
#include <stdlib.h>
#define rxPin 10
#define txPin 11
IRsend irsend;
SoftwareSerial btSerial(rxPin, txPin);
//----------------------------------------------------------------
int dataPosition = 0;
const int dataUpperLimit = 300;
byte dataBytes[dataUpperLimit];
//-----------------------------------------------------------------
void setup() {
  //Serial.begin(9600);//Enable/disable console serial
  btSerial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}
//-------------------------------------------------------------------
void loop() {
  if (btSerial.available() > 0) {
     dataBytes[dataPosition] = btSerial.read();
     //stop reading at this point
     if(dataPosition > 0 && (dataPosition % 2) != 0 && dataBytes[dataPosition-1] == 255 && dataBytes[dataPosition] == 255){
       //create array
       unsigned int carrierFrequency = 0;
       unsigned int dataBuffer[(dataPosition/2)-1];
       int byteCounter = 0;
       for (int i = 0; i < dataPosition/2; i++) {
          int currentInt = word(dataBytes[byteCounter+1],dataBytes[byteCounter]);
          if(i == 0){
               carrierFrequency = currentInt;
          } else {
               dataBuffer[i-1] = currentInt;
          }
          byteCounter = byteCounter + 2;
       }
      //send IR
      digitalWrite(LED_BUILTIN, HIGH); 
      int carrierKhz = carrierFrequency/1000;
      irsend.sendRaw(dataBuffer, dataPosition/2, carrierKhz);
      digitalWrite(LED_BUILTIN, LOW); 
      //reset reading data
      dataPosition = 0;
      memset(dataBytes, 0, dataUpperLimit);
      btSerial.write(1);
       
     } else {
       dataPosition++;
     }
  } 
}