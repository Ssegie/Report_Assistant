from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='file',
            field=models.FileField(upload_to='reports/', null=True, blank=True),
        ),
    ]
