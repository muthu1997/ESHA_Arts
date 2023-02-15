package com.handmade.paintings.mobile;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.view.WindowManager;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
    protected void onCreate(Bundle savedInstanceState) {
       SplashScreen.show(this, R.style.SplashScreenTheme, true);  // here
        super.onCreate(savedInstanceState);
       getWindow().setFlags(
               WindowManager.LayoutParams.FLAG_SECURE,
               WindowManager.LayoutParams.FLAG_SECURE
       );
    }

  @Override
  protected String getMainComponentName() {
    return "SPCustomer";
  }
}
