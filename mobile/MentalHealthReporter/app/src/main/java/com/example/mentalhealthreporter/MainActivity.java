package com.example.mentalhealthreporter;

import android.app.AppOpsManager;
import android.content.Context;
import android.net.VpnService;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.content.Intent;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import android.provider.Settings;
import android.text.TextUtils;

public class MainActivity extends AppCompatActivity {

    Intent foregroundServiceIntent;
    private static final int REQUEST_CODE_VPN = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        AppOpsManager appOps = (AppOpsManager) getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(), getPackageName());
        if(mode != AppOpsManager.MODE_ALLOWED) {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            startActivity(intent);
        }

        /*Intent prepareIntent = VpnService.prepare(this);
        if (prepareIntent != null) {
            Log.d("VPN Permission", "VPN permission not granted. Starting activity for result.");
            // prepareIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            // startActivity(prepareIntent); // the user must grant VPN access manually
            startActivityForResult(prepareIntent, REQUEST_CODE_VPN);
        }*/

        String pkgName = this.getPackageName();
        final String flat = Settings.Secure.getString(this.getContentResolver(), "enabled_notification_listeners");
        if(!(flat != null && flat.contains(pkgName))) {
            Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
            startActivity(intent);
        }

        foregroundServiceIntent = new Intent(this, ForegroundService.class);
    }

    public void start(View v) {
        startService(foregroundServiceIntent);
    }

    public void stop(View v) {
        stopService(foregroundServiceIntent);
    }

    /*@Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_CODE_VPN) {
            if (resultCode == RESULT_OK) {
                // Permission granted
                Log.d("VPN Permission", "VPN permission granted by user.");
                //startVpnService(); // Start the VPN service after permission is granted
            } else {
                // Permission denied
                Log.d("VPN Permission", "VPN permission denied by user.");
                // Optionally notify the user or retry
                Toast.makeText(this, "VPN permission is required for the service to work.", Toast.LENGTH_SHORT).show();
            }
        }
    }*/
}