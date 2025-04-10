package com.example.mentalhealthreporter;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.net.VpnService;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ForegroundService extends Service {
    private Context context;
    private final int NOTIFICATION_ID = 1;
    private boolean isDestroyed = false;

    public ForegroundService() {
    }

    @RequiresApi(api = Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
    @Override public void onCreate() {
        super.onCreate();
        context = this;
        if (Build.VERSION.SDK_INT < 34) {
            startForeground(NOTIFICATION_ID, showNotification("This is content."));
        } else {
            startForeground(NOTIFICATION_ID, showNotification("This is content."), ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
        }

    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        Toast.makeText(context, "Starting service...", Toast.LENGTH_SHORT).show();

        // 1. Start App Usage Tracking
        if (!isDestroyed) {
            doTask();
        }

        /* // 2. Start VPN if permission is granted
        Intent prepareIntent = VpnService.prepare(this);
        if (prepareIntent != null) {
            Log.d("VPN Permission", "VPN permission not granted. Starting activity for result.");
            prepareIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(prepareIntent); // the user must grant VPN access manually
        } else {
            Log.d("VPN Permission", "VPN permission already granted.");
            startVpnService(); // already granted
        }*/

        startNotificationsService();

        // return super.onStartCommand(intent, flags, startId);
        return START_STICKY;
    }

    private void doTask() {
        final int[] data = new int[1];
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());
        executorService.execute(() -> {
            //task
            while (!isDestroyed) {
                handler.post(this::getAppUsageStats);
                try {
                    /*handler.post(() -> {
                        //update ui
                        updateNotification(String.valueOf(data[0]));
                    });*/
                    Thread.sleep(1000 * 60 * 60 * 24);
                    //Thread.sleep(1000 * 5);
                    //handler.post(this::getAppUsageStats);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    /*private void getAppUsageStats() {
        UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);

        long endTime = System.currentTimeMillis();
        long beginTime = endTime - 1000 * 60 * 60; // last hour

        List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, beginTime, endTime);

        if (usageStatsList == null || usageStatsList.isEmpty()) {
            Log.d("AppUsage", "No usage stats available. Permission may not be granted.");
            return;
        }

        for (UsageStats usageStats : usageStatsList) {
            String packageName = usageStats.getPackageName();
            long totalTimeInForeground = usageStats.getTotalTimeInForeground();

            Log.d("AppUsage", packageName + " used for " + (totalTimeInForeground / 1000) + " seconds");
        }
    }*/

    private void getAppUsageStats() {
        SharedPreferences prefs = getSharedPreferences("usage_prefs", MODE_PRIVATE);
        String lastSavedDate = prefs.getString("last_saved_date", "");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        String currentDate = sdf.format(new Date());

        if (lastSavedDate.equals(currentDate)) {
            Log.d("AppUsage", "Already saved for today: " + currentDate);
            return;
        }

        UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);

        long endTime = System.currentTimeMillis();
        long beginTime = endTime - 1000 * 60 * 60 * 24;

        List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, beginTime, endTime);

        if (usageStatsList == null || usageStatsList.isEmpty()) {
            Log.d("AppUsage", "No usage stats available. Permission may not be granted.");
            return;
        }

        JSONObject jsonObject = new JSONObject();
        JSONObject screenTime = new JSONObject();
        JSONArray notifications = readNotificationsFromFile();

        try {
            for (UsageStats usageStats : usageStatsList) {
                String packageName = usageStats.getPackageName();
                long totalTimeInForeground = usageStats.getTotalTimeInForeground() / 1000; // seconds

                if (totalTimeInForeground > 3 * 60) {
                    screenTime.put(packageName, totalTimeInForeground);
                    Log.d("AppUsage", packageName + " used for " + totalTimeInForeground + " seconds");
                }
            }

            jsonObject.put("date", currentDate);
            jsonObject.put("screen_time", screenTime);
            jsonObject.put("notifications", notifications);

            JSONArray jsonArray = new JSONArray();
            jsonArray.put(jsonObject);

            saveJsonToFile(jsonObject.toString());

            prefs.edit().putString("last_saved_date", currentDate).apply();
            Log.d("AppUsage", "Saved usage stats for " + currentDate);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private JSONArray readNotificationsFromFile() {
        JSONArray jsonArray = new JSONArray();
        File file = new File(getExternalFilesDir(null), "notifications.txt");

        if (!file.exists()) {
            return jsonArray;
        }

        try {
            FileInputStream fis = new FileInputStream(file);
            BufferedReader reader = new BufferedReader(new InputStreamReader(fis));
            String line;

            while ((line = reader.readLine()) != null) {
                jsonArray.put(line);
            }

            reader.close();
            fis.close();

            FileOutputStream fos = new FileOutputStream(file, false); // 'false' means overwrite mode
            fos.write("".getBytes());
            fos.close();
            Log.d("NotificationRead", "Flushed file after reading.");

        } catch (IOException e) {
            e.printStackTrace();
        }

        return jsonArray;
    }


    private void saveJsonToFile(String newEntryJson) {
        try {
            File file = new File(getExternalFilesDir(null), "app_usage.txt");
            JSONArray jsonArray;

            if (file.exists()) {
                FileInputStream fis = new FileInputStream(file);
                StringBuilder builder = new StringBuilder();
                BufferedReader reader = new BufferedReader(new InputStreamReader(fis));
                String line;

                while ((line = reader.readLine()) != null) {
                    builder.append(line);
                }

                fis.close();
                reader.close();

                jsonArray = new JSONArray(builder.toString());
            } else {
                jsonArray = new JSONArray();
            }

            JSONObject newEntry = new JSONObject(newEntryJson);
            jsonArray.put(newEntry);

            FileOutputStream fos = new FileOutputStream(file);
            fos.write(jsonArray.toString(4).getBytes()); // pretty print
            fos.close();

            Log.d("AppUsage", "Appended JSON to " + file.getAbsolutePath());
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
    }


    /*private void startVpnService() {
        Intent vpnIntent = new Intent(this, TrafficVpnService.class);
        startService(vpnIntent);
    }*/

    private void startNotificationsService() {
        Intent notificationsIntent = new Intent(this, MyNotificationListenerService.class);
        startService(notificationsIntent);

        ComponentName cn = new ComponentName(this, MyNotificationListenerService.class);
        PackageManager pm = getPackageManager();

        // Temporarily disable
                pm.setComponentEnabledSetting(cn,
                        PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                        PackageManager.DONT_KILL_APP);

        // Then re-enable
                pm.setComponentEnabledSetting(cn,
                        PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                        PackageManager.DONT_KILL_APP);
    }
    private void stopNotificationsService() {
        // stopService(notificationsIntent);
    }

    private void updateNotification(String data) {
        Notification notification = showNotification(data);
        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NOTIFICATION_ID, notification);
    }

    private Notification showNotification(String content) {
        String CHANNEL_ID = "100";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(
                    new NotificationChannel(CHANNEL_ID, "Foreground Notification",
                            NotificationManager.IMPORTANCE_HIGH));
        }

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Foreground Service")
                .setContentText(content)
                .setOnlyAlertOnce(true)
                .setOngoing(true)
                .setSmallIcon(R.drawable.ic_launcher_background)
                .build();
    }

    @Override public void onDestroy() {
        super.onDestroy();
        isDestroyed = true;
        // stopService(new Intent(this, TrafficVpnService.class));
        stopNotificationsService();
        Toast.makeText(context, "Stopping service...", Toast.LENGTH_SHORT).show();
    }
}