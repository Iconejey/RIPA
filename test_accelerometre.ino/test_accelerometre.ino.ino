#include <Wire.h>

float accelX, accelY, accelZ;
float gForceX, gForceY, gForceZ;

void setup() {
  Serial.begin(2000000);
  Wire.begin();
  pinMode(2, INPUT);
  setupMPU();
}

void loop() {
  recordAccelRegisters();
  if (Serial.available() && Serial.read() == '\t') {
    printData();
  }
}

void setupMPU() {
  Wire.beginTransmission(0b1101000);
  Wire.write(0x6B);
  Wire.write(0b00000000);
  Wire.endTransmission();
  Wire.beginTransmission(0b1101000);
  Wire.write(0x1B);
  Wire.write(0x00000000);
  Wire.endTransmission();

  Wire.beginTransmission(0b1101000);
  Wire.write(0x1C);
  Wire.write(0b00000000);
  Wire.endTransmission();
}

void recordAccelRegisters() {
  Wire.beginTransmission(0b1101000);
  Wire.write(0x3B);
  Wire.endTransmission();
  Wire.requestFrom(0b1101000, 6);
  while (Wire.available() < 6);
  accelX = Wire.read() << 8 | Wire.read();
  accelY = Wire.read() << 8 | Wire.read();
  accelZ = Wire.read() << 8 | Wire.read();
  processAccelData();
}

void processAccelData() {
  float coef = 0.01;
  gForceX = accelX / 16384.0 * coef + gForceX * (1 - coef);
  gForceY = accelY / 16384.0 * coef + gForceY * (1 - coef);
  gForceZ = accelZ / 16384.0 * coef + gForceZ * (1 - coef);
}


void printData() {
  
  Serial.print(' ');
  Serial.print(gForceX);
  Serial.print(' ');
  Serial.print(gForceY);
  Serial.print(' ');
  if (digitalRead(2) == HIGH) {
    Serial.print(1);
  } else {
    Serial.print(0);
  }
  Serial.print('\n');
}
