/*
Copyright 2022 New Vector Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as YAML from "yaml";
import * as fs from "fs";

export type BuildConfig = {
    // Dev note: make everything here optional for user safety. Invalid
    // configs are very possible.

    // Allow config to skip dependency version check
    skip_module_dependency_version_check?: boolean;

    // The module references to include in the build.
    modules?: string[];
};

export function readBuildConfig(): BuildConfig {
    if (fs.existsSync("./build_config.yaml")) {
        return YAML.parse(fs.readFileSync("./build_config.yaml", "utf-8"));
    }
    return {}; // no config
}
