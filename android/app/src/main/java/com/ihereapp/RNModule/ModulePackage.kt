package com.ihereapp.RNModule

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class ModulePackage : ReactPackage {

    companion object {
        lateinit var reactContext: ReactApplicationContext
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        ModulePackage.reactContext = reactContext
        return listOf(
                LocationModule(reactContext),
                BeaconModule(reactContext),
                NewLocationModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<View, ReactShadowNode<*>>> {
        return emptyList()
    }
}