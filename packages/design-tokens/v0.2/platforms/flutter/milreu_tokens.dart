/// © 2026 Fernando Rodrigues de Jácomo.
/// Produzido no âmbito do Projeto Comunitário de Milreu.
/// Direitos: consultar RIGHTS.md.
import 'package:flutter/material.dart';

abstract final class MilreuColors {
  static const paper = Color(0xFFFFFCF7);
  static const reading = Color(0xFFFFFFFF);
  static const linen = Color(0xFFF7F1E7);
  static const ink = Color(0xFF1E1A17);
  static const inkSecondary = Color(0xFF5E554D);
  static const signature = Color(0xFFA83227);
  static const signatureDeep = Color(0xFF7E251C);
  static const patina = Color(0xFF5E7267);
  static const sepia = Color(0xFF8A6A4A);
  static const hypothesis = Color(0xFF6F6456);
  static const focus = Color(0xFF315D6D);
}

abstract final class MilreuSpacing {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 16.0;
  static const lg = 24.0;
  static const xl = 32.0;
  static const xxl = 48.0;
}

abstract final class MilreuRadius {
  static const compact = 2.0;
  static const standard = 4.0;
  static const comfortable = 8.0;
}

abstract final class MilreuMotion {
  static const fast = Duration(milliseconds: 120);
  static const standard = Duration(milliseconds: 200);
  static const editorial = Duration(milliseconds: 320);
  static const immersive = Duration(milliseconds: 500);
}

/// Font files are not included. Configure Fraunces, Spectral and Archivo
/// only after confirming licensing and loading strategy.
abstract final class MilreuFontFamilies {
  static const display = 'Fraunces';
  static const editorial = 'Spectral';
  static const interface = 'Archivo';
}
