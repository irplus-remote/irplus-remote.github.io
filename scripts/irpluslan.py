'''

The MIT License (MIT)
Copyright (c) 2016 binarymode.android@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

'''

from BaseHTTPServer import BaseHTTPRequestHandler
import urlparse
import pigpio
import sys
import time
import pigpio
import threading

#This script contains code taken from https://www.raspberrypi.org/forums

class GPIOIRTransmission:

   def __init__(self, pi, gpio, carrier_hz):

      self.pi = pi
      self.gpio = gpio
      self.carrier_hz = carrier_hz
      self.micros = 1000000 / carrier_hz
      self.on_mics = self.micros / 2
      self.off_mics = self.micros - self.on_mics
      self.offset = 0

      self.wf = []
      self.wid = -1

      pi.set_mode(gpio, pigpio.OUTPUT)

   def clear_code(self):
      self.wf = []
      if self.wid >= 0:
         self.pi.wave_delete(self.wid)
         self.wid = -1

   def construct_code(self):
      if len(self.wf) > 0:
         pulses = self.pi.wave_add_generic(self.wf)
         self.wid = self.pi.wave_create()

   def send_code(self):
      if self.wid >= 0:
         self.pi.wave_send_once(self.wid)
         while self.pi.wave_tx_busy():
            pass

   def add_to_code(self, on_micros, off_micros):
    
      on = (on_micros + self.on_mics) / self.micros

      if (on*2) + 1 + len(self.wf) > 680:
         
         pulses = self.pi.wave_add_generic(self.wf)
         self.offset = self.pi.wave_get_micros()

         self.wf = [pigpio.pulse(0, 0, self.offset)]

      for x in range(on):
         self.wf.append(pigpio.pulse(1<<self.gpio, 0, self.on_mics))
         self.wf.append(pigpio.pulse(0, 1<<self.gpio, self.off_mics))

      self.wf.append(pigpio.pulse(0, 0, off_micros))


class GetHandler(BaseHTTPRequestHandler):

    def do_GET(self):

        parsed_path = urlparse.urlparse(self.path);
        querydict = urlparse.parse_qs(parsed_path.query);
        
        if len(querydict) == 1:
            
            query_command = querydict["command"];
            
            if query_command[0] == "kill":
                assassin = threading.Thread(target=server.shutdown)
                assassin.daemon = True
                assassin.start()

        if len(querydict) == 2:
           
          query_carrier = querydict["carrier"];
          query_code = querydict["code"];

          query_code_split = query_code[0].split(" ");

          pulses = len(query_code_split);

          pi = pigpio.pi() 
          tx = GPIOIRTransmission(pi, 17, int(query_carrier[0])) 
          tx.clear_code()
           
          for x in xrange(0, pulses, 2):
               tx.add_to_code(int(query_code_split[x]), int(query_code_split[x+1]))

          tx.construct_code()
          tx.send_code()
          tx.clear_code()
          pi.stop()

          self.send_response(200)
          self.end_headers()
          self.wfile.write("OK")

        return


if __name__ == '__main__':
    from BaseHTTPServer import HTTPServer
    server = HTTPServer(('0.0.0.0', 8080), GetHandler)
    print 'Starting server, use <Ctrl-C> to stop'
    server.serve_forever()