import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // return <Redirect href={"./(patient)/HomePatient"} />;
  return <Redirect href={"./(auth)/RoleSelection"} />;
}
